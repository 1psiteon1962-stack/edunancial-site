# Global Curriculum CMS

Edunancial now includes a centralized Global Curriculum CMS backed by `curriculum/cms/global-content-store.json`.

## Scope

The CMS is the single source of truth for:

- Track → Level → Lesson → Section → Component hierarchy
- Localization blocks (language and region)
- Lesson workflow state
- Version history and rollback snapshots
- Media records and usage tracking

## Workflow states

- `draft`
- `internal_review`
- `legal_review`
- `tax_review`
- `localization_review`
- `translation_review`
- `approved`
- `published`
- `archived`

## Roles

- `super_admin`
- `administrator`
- `editor`
- `reviewer`
- `translator`
- `legal_reviewer`
- `tax_reviewer`
- `instructor`
- `read_only`

API role and actor are read from:

- `x-cms-role`
- `x-cms-user`

## API endpoints

- `GET /api/cms/content` — list/search lessons and dashboard summary
- `GET /api/cms/content?lessonId=<id>` — read one lesson
- `POST /api/cms/content` — perform CMS actions (`create`, `edit`, `rollback`, `approve`, `publish`, `archive`, `restore`, `assignReviewer`, `assignTranslator`, `lock`, `unlock`)
- `GET /api/cms/content/:lessonId/versions` — version history
- `GET /api/cms/content/:lessonId/localization` — localization blocks for lesson
- `GET /api/cms/media` — list media library
- `POST /api/cms/media` — upload media metadata and track usage

## Publication pipeline checks

Publishing validates:

- required lesson metadata
- references
- localization blocks
- competency standards

When successful, publication metadata is stamped for:

- search indexing
- sitemap refresh
- cache clear
- deployment preparation

## Dashboard

`/admin/cms` provides:

- total lessons
- published and draft counts
- needs review / translation / localization counts
- pending approvals
- recently updated lessons
- recent activity

## Testing

`npm run curriculum:test` now includes CMS engine tests for:

- create, edit, rollback
- approve, publish, archive, restore
- media upload
- reviewer/translator assignment
- search and status filtering
- permission enforcement
