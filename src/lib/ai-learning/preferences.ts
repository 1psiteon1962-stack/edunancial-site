import { getNeonSql } from "@/lib/db/neon";
import { normalizeLearningGoals, type LearningGoal } from "./goals";

export type LearnerAIPreferences = {
  countryCode: string | null; jurisdictionCode: string | null; preferredLanguage: string;
  learningGoals: LearningGoal[]; aiAssistanceEnabled: boolean;
};

export async function getLearnerAIPreferences(userId: string): Promise<LearnerAIPreferences | null> {
  const sql = getNeonSql(); if (!sql) return null;
  const rows = await sql`select country_code, jurisdiction_code, preferred_language, learning_goals, ai_assistance_enabled
    from learner_ai_preferences where user_id = ${userId} limit 1`;
  const row = rows[0] as Record<string, unknown> | undefined; if (!row) return null;
  return { countryCode: typeof row.country_code === "string" ? row.country_code : null,
    jurisdictionCode: typeof row.jurisdiction_code === "string" ? row.jurisdiction_code : null,
    preferredLanguage: typeof row.preferred_language === "string" ? row.preferred_language : "en",
    learningGoals: normalizeLearningGoals(row.learning_goals), aiAssistanceEnabled: row.ai_assistance_enabled !== false };
}

export async function upsertLearnerAIPreferences(userId: string, value: LearnerAIPreferences) {
  const sql = getNeonSql(); if (!sql) throw new Error("DATABASE_URL is not configured.");
  await sql`insert into learner_ai_preferences (user_id,country_code,jurisdiction_code,preferred_language,learning_goals,ai_assistance_enabled,updated_at)
    values (${userId},${value.countryCode},${value.jurisdictionCode},${value.preferredLanguage},${JSON.stringify(value.learningGoals)}::jsonb,${value.aiAssistanceEnabled},now())
    on conflict (user_id) do update set country_code=excluded.country_code,jurisdiction_code=excluded.jurisdiction_code,
    preferred_language=excluded.preferred_language,learning_goals=excluded.learning_goals,ai_assistance_enabled=excluded.ai_assistance_enabled,updated_at=now()`;
}
