import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const STORE_PATH = join(process.cwd(), "curriculum", "cms", "global-content-store.json");
const LOCK_LEASE_MS = 10 * 60 * 1000;

export const CMS_ROLES = [
  "super_admin",
  "administrator",
  "editor",
  "reviewer",
  "translator",
  "legal_reviewer",
  "tax_reviewer",
  "instructor",
  "read_only",
];

export const WORKFLOW_STATES = [
  "draft",
  "internal_review",
  "legal_review",
  "tax_review",
  "localization_review",
  "translation_review",
  "approved",
  "published",
  "archived",
];

const ROLE_PERMISSIONS = {
  super_admin: ["*"],
  administrator: ["create", "edit", "read", "search", "assign", "review", "publish", "archive", "restore", "rollback", "media"],
  editor: ["create", "edit", "read", "search", "assign", "review", "media"],
  reviewer: ["read", "search", "review"],
  translator: ["read", "search", "edit", "review"],
  legal_reviewer: ["read", "search", "review"],
  tax_reviewer: ["read", "search", "review"],
  instructor: ["read", "search"],
  read_only: ["read", "search"],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createDefaultCmsState() {
  return {
    lessons: {},
    media: {},
    activity: [],
    settings: {
      aiAssistance: {
        enabled: true,
        autoPublish: false,
        requiresHumanApproval: true,
      },
    },
  };
}

function nowIso() {
  return new Date().toISOString();
}

function incrementVersion(versionNumber) {
  const numeric = Number(versionNumber || 1);
  return Number.isFinite(numeric) ? numeric + 1 : 1;
}

export function hasPermission(role, action) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes("*") || permissions.includes(action);
}

function assertPermission(role, action) {
  if (!hasPermission(role, action)) {
    throw new Error(`Role ${role || "unknown"} cannot perform ${action}`);
  }
}

function getLessonOrThrow(state, lessonId) {
  const lesson = state.lessons[lessonId];
  if (!lesson) {
    throw new Error(`Lesson ${lessonId} not found`);
  }
  return lesson;
}

function ensureEditableLock(lesson, editor, lockMessage = "Currently being edited by") {
  const lock = lesson.lock;
  if (!lock || !lock.lockedBy || !lock.expiresAt) {
    return;
  }

  if (new Date(lock.expiresAt).getTime() <= Date.now()) {
    lesson.lock = null;
    return;
  }

  if (lock.lockedBy !== editor) {
    throw new Error(`${lockMessage} ${lock.lockedBy}`);
  }
}

function appendActivity(state, event) {
  state.activity.unshift({ timestamp: nowIso(), ...event });
  state.activity = state.activity.slice(0, 100);
}

function computeReadiness(lesson) {
  return {
    hasRequiredFields: Boolean(lesson.title && lesson.track && lesson.level && lesson.lessonNumber),
    hasReferences: Array.isArray(lesson.references) && lesson.references.length > 0,
    hasLocalization: Object.keys(lesson.localizations || {}).length > 0,
    hasCompetencies: Array.isArray(lesson.competencyStandards) && lesson.competencyStandards.length > 0,
  };
}

function computeFilters(lesson) {
  const readiness = computeReadiness(lesson);
  return {
    published: lesson.status === "published",
    draft: lesson.status === "draft",
    needsTranslation: !readiness.hasLocalization,
    needsLegalReview: lesson.status === "legal_review",
    needsTaxReview: lesson.status === "tax_review",
    missingReferences: !readiness.hasReferences,
    missingLocalization: !readiness.hasLocalization,
    needsAiReview: lesson.aiReview?.required !== false,
    readyToPublish: WORKFLOW_STATES.includes(lesson.status) && lesson.status !== "published" && Object.values(readiness).every(Boolean),
  };
}

function updateMediaUsage(state, lessonId, mediaIds = []) {
  const keep = new Set(mediaIds);
  for (const media of Object.values(state.media)) {
    media.usedBy = (media.usedBy || []).filter((id) => id !== lessonId);
  }

  for (const mediaId of keep) {
    const media = state.media[mediaId];
    if (!media) {
      continue;
    }
    media.usedBy = Array.from(new Set([...(media.usedBy || []), lessonId]));
    media.isOrphaned = media.usedBy.length === 0;
  }

  for (const media of Object.values(state.media)) {
    media.isOrphaned = (media.usedBy || []).length === 0;
  }
}

export function createInMemoryCmsEngine(initialState = createDefaultCmsState()) {
  const state = clone(initialState);

  const engine = {
    getState() {
      return clone(state);
    },

    getDashboard() {
      const lessons = Object.values(state.lessons);
      return {
        totalLessons: lessons.length,
        published: lessons.filter((lesson) => lesson.status === "published").length,
        draft: lessons.filter((lesson) => lesson.status === "draft").length,
        needsReview: lessons.filter((lesson) => lesson.status.includes("review")).length,
        needsTranslation: lessons.filter((lesson) => computeFilters(lesson).needsTranslation).length,
        missingLocalization: lessons.filter((lesson) => computeFilters(lesson).missingLocalization).length,
        recentlyUpdated: lessons
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5)
          .map((lesson) => ({ lessonId: lesson.lessonId, title: lesson.title, updatedAt: lesson.updatedAt })),
        recentActivity: state.activity.slice(0, 10),
        pendingApprovals: lessons.filter((lesson) => lesson.status === "approved").length,
      };
    },

    createLesson(input, actor) {
      assertPermission(actor.role, "create");
      const lessonId = input.lessonId;
      if (!lessonId) {
        throw new Error("lessonId is required");
      }
      if (state.lessons[lessonId]) {
        throw new Error(`Lesson ${lessonId} already exists`);
      }

      const createdAt = nowIso();
      const lesson = {
        lessonId,
        track: input.track,
        level: input.level,
        lessonNumber: input.lessonNumber,
        section: input.section || null,
        component: input.component || null,
        title: input.title || "",
        keyword: input.keyword || "",
        seo: input.seo || {},
        author: input.author || actor.userId,
        language: input.language || "en",
        region: input.region || "global",
        status: "draft",
        references: input.references || [],
        competencyStandards: input.competencyStandards || [],
        localizations: input.localizations || {},
        blocks: input.blocks || {},
        mediaIds: input.mediaIds || [],
        aiReview: { required: true, notes: [] },
        versionNumber: 1,
        versions: [
          {
            versionNumber: 1,
            timestamp: createdAt,
            editor: actor.userId,
            reasonForChange: input.reasonForChange || "Initial lesson creation",
            approvalStatus: "draft",
            snapshot: clone(input),
          },
        ],
        assignments: {
          reviewer: null,
          translator: null,
          legalReviewer: null,
          taxReviewer: null,
        },
        lock: null,
        publication: {
          searchIndexedAt: null,
          sitemapRefreshedAt: null,
          cacheClearedAt: null,
          deploymentPreparedAt: null,
        },
        createdAt,
        updatedAt: createdAt,
      };

      state.lessons[lessonId] = lesson;
      updateMediaUsage(state, lessonId, lesson.mediaIds);
      appendActivity(state, { action: "lesson.created", lessonId, actor: actor.userId });
      return clone(lesson);
    },

    editLesson(lessonId, updates, actor) {
      assertPermission(actor.role, "edit");
      const lesson = getLessonOrThrow(state, lessonId);
      ensureEditableLock(lesson, actor.userId);

      Object.assign(lesson, updates);
      lesson.mediaIds = updates.mediaIds || lesson.mediaIds;
      lesson.updatedAt = nowIso();
      lesson.versionNumber = incrementVersion(lesson.versionNumber);
      lesson.versions.push({
        versionNumber: lesson.versionNumber,
        timestamp: lesson.updatedAt,
        editor: actor.userId,
        reasonForChange: updates.reasonForChange || "Lesson updated",
        approvalStatus: lesson.status,
        snapshot: clone(lesson),
      });

      updateMediaUsage(state, lessonId, lesson.mediaIds);
      appendActivity(state, { action: "lesson.edited", lessonId, actor: actor.userId });
      return clone(lesson);
    },

    rollbackLesson(lessonId, targetVersion, actor) {
      assertPermission(actor.role, "rollback");
      const lesson = getLessonOrThrow(state, lessonId);
      const version = lesson.versions.find((item) => item.versionNumber === targetVersion);
      if (!version) {
        throw new Error(`Version ${targetVersion} not found`);
      }
      ensureEditableLock(lesson, actor.userId);

      const snapshot = clone(version.snapshot);
      Object.assign(lesson, snapshot);
      lesson.updatedAt = nowIso();
      lesson.versionNumber = incrementVersion(lesson.versionNumber);
      lesson.versions.push({
        versionNumber: lesson.versionNumber,
        timestamp: lesson.updatedAt,
        editor: actor.userId,
        reasonForChange: `Rollback to version ${targetVersion}`,
        approvalStatus: lesson.status,
        snapshot: clone(lesson),
      });
      appendActivity(state, { action: "lesson.rolled_back", lessonId, actor: actor.userId });
      return clone(lesson);
    },

    assignRole(lessonId, assignmentKey, assignee, actor) {
      assertPermission(actor.role, "assign");
      const lesson = getLessonOrThrow(state, lessonId);
      lesson.assignments[assignmentKey] = assignee;
      lesson.updatedAt = nowIso();
      appendActivity(state, { action: `lesson.assigned.${assignmentKey}`, lessonId, actor: actor.userId, assignee });
      return clone(lesson);
    },

    transitionStatus(lessonId, status, actor) {
      assertPermission(actor.role, status === "published" ? "publish" : "review");
      const lesson = getLessonOrThrow(state, lessonId);
      if (!WORKFLOW_STATES.includes(status)) {
        throw new Error(`Unsupported workflow status ${status}`);
      }
      lesson.status = status;
      lesson.updatedAt = nowIso();
      appendActivity(state, { action: `lesson.status.${status}`, lessonId, actor: actor.userId });
      return clone(lesson);
    },

    publishLesson(lessonId, actor) {
      assertPermission(actor.role, "publish");
      const lesson = getLessonOrThrow(state, lessonId);
      const readiness = computeReadiness(lesson);
      const failures = Object.entries(readiness)
        .filter(([, ok]) => !ok)
        .map(([key]) => key);
      if (failures.length > 0) {
        throw new Error(`Lesson ${lessonId} failed publication checks: ${failures.join(", ")}`);
      }

      const stamp = nowIso();
      lesson.status = "published";
      lesson.updatedAt = stamp;
      lesson.publication = {
        searchIndexedAt: stamp,
        sitemapRefreshedAt: stamp,
        cacheClearedAt: stamp,
        deploymentPreparedAt: stamp,
      };
      lesson.versionNumber = incrementVersion(lesson.versionNumber);
      lesson.versions.push({
        versionNumber: lesson.versionNumber,
        timestamp: stamp,
        editor: actor.userId,
        reasonForChange: "Published lesson",
        approvalStatus: "published",
        snapshot: clone(lesson),
      });
      appendActivity(state, { action: "lesson.published", lessonId, actor: actor.userId, checks: readiness });
      return clone(lesson);
    },

    archiveLesson(lessonId, actor) {
      assertPermission(actor.role, "archive");
      return this.transitionStatus(lessonId, "archived", actor);
    },

    restoreLesson(lessonId, actor) {
      assertPermission(actor.role, "restore");
      return this.transitionStatus(lessonId, "draft", actor);
    },

    lockLesson(lessonId, actor) {
      assertPermission(actor.role, "edit");
      const lesson = getLessonOrThrow(state, lessonId);
      ensureEditableLock(lesson, actor.userId);
      lesson.lock = {
        lockedBy: actor.userId,
        lockedAt: nowIso(),
        expiresAt: new Date(Date.now() + LOCK_LEASE_MS).toISOString(),
      };
      appendActivity(state, { action: "lesson.locked", lessonId, actor: actor.userId });
      return clone(lesson.lock);
    },

    unlockLesson(lessonId, actor) {
      assertPermission(actor.role, "edit");
      const lesson = getLessonOrThrow(state, lessonId);
      if (lesson.lock?.lockedBy && lesson.lock.lockedBy !== actor.userId && !hasPermission(actor.role, "*")) {
        throw new Error(`Currently being edited by ${lesson.lock.lockedBy}`);
      }
      lesson.lock = null;
      appendActivity(state, { action: "lesson.unlocked", lessonId, actor: actor.userId });
      return true;
    },

    uploadMedia(input, actor) {
      assertPermission(actor.role, "media");
      const mediaId = input.mediaId;
      if (!mediaId) {
        throw new Error("mediaId is required");
      }
      const media = {
        mediaId,
        type: input.type,
        url: input.url,
        title: input.title || mediaId,
        language: input.language || "en",
        region: input.region || "global",
        usedBy: input.usedBy || [],
        uploadedBy: actor.userId,
        uploadedAt: nowIso(),
        isOrphaned: !(input.usedBy || []).length,
      };
      state.media[mediaId] = media;
      appendActivity(state, { action: "media.uploaded", mediaId, actor: actor.userId });
      return clone(media);
    },

    getMedia() {
      return clone(Object.values(state.media));
    },

    getLesson(lessonId, actor) {
      assertPermission(actor.role, "read");
      return clone(getLessonOrThrow(state, lessonId));
    },

    getVersionHistory(lessonId, actor) {
      assertPermission(actor.role, "read");
      const lesson = getLessonOrThrow(state, lessonId);
      return clone(lesson.versions);
    },

    getLocalization(lessonId, actor) {
      assertPermission(actor.role, "read");
      const lesson = getLessonOrThrow(state, lessonId);
      return clone(lesson.localizations || {});
    },

    listLessons(query = {}, actor) {
      assertPermission(actor.role, "search");
      const lessons = Object.values(state.lessons);
      return clone(
        lessons.filter((lesson) => {
          const text = `${lesson.lessonId} ${lesson.track} ${lesson.level} ${lesson.title} ${lesson.keyword} ${lesson.author} ${lesson.status} ${lesson.region} ${lesson.language} ${(lesson.competencyStandards || []).join(" ")} ${(lesson.seo?.keywords || []).join(" ")}`.toLowerCase();
          const keyword = String(query.keyword || "").toLowerCase();

          if (query.lessonId && lesson.lessonId !== query.lessonId) return false;
          if (query.track && lesson.track !== query.track) return false;
          if (query.level && String(lesson.level) !== String(query.level)) return false;
          if (query.title && !lesson.title.toLowerCase().includes(String(query.title).toLowerCase())) return false;
          if (query.author && lesson.author !== query.author) return false;
          if (query.status && lesson.status !== query.status) return false;
          if (query.region && lesson.region !== query.region) return false;
          if (query.language && lesson.language !== query.language) return false;
          if (query.competency && !(lesson.competencyStandards || []).includes(query.competency)) return false;
          if (query.seoKeyword && !((lesson.seo?.keywords || []).includes(query.seoKeyword))) return false;
          if (keyword && !text.includes(keyword)) return false;

          if (query.filter && !computeFilters(lesson)[query.filter]) return false;
          return true;
        })
      );
    },
  };

  return engine;
}

function loadFileState() {
  if (!existsSync(STORE_PATH)) {
    return createDefaultCmsState();
  }

  const parsed = JSON.parse(readFileSync(STORE_PATH, "utf8"));
  return {
    ...createDefaultCmsState(),
    ...parsed,
    lessons: parsed.lessons || {},
    media: parsed.media || {},
    activity: parsed.activity || [],
  };
}

function persistFileState(state) {
  mkdirSync(dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(state, null, 2));
}

export function createFileBackedCmsEngine() {
  const baseEngine = createInMemoryCmsEngine(loadFileState());
  const withPersistence = {};

  for (const [key, value] of Object.entries(baseEngine)) {
    if (typeof value !== "function") {
      withPersistence[key] = value;
      continue;
    }

    withPersistence[key] = (...args) => {
      const result = value.apply(baseEngine, args);
      persistFileState(baseEngine.getState());
      return result;
    };
  }

  return withPersistence;
}
