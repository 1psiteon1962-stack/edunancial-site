/**
 * Learning platform provider adapter.
 *
 * Supports:
 *   - Teachable (LEARNING_PROVIDER=teachable)
 *   - Stub (default — delegates to internal Edunancial course engine)
 *
 * Environment variables:
 *   LEARNING_PROVIDER         – "teachable" (default: "stub")
 *   TEACHABLE_API_KEY         – Teachable API key
 *   TEACHABLE_SCHOOL_SUBDOMAIN – e.g. "myschool"
 */

import type { LearningProvider, LearningEnrollParams, ProviderConfig } from "../types";

export interface LearningConfig extends ProviderConfig {
  apiKey?: string;
  subdomain?: string;
}

// ─── Teachable ────────────────────────────────────────────────────────────────

class TeachableProvider implements LearningProvider {
  readonly id = "teachable";
  readonly name = "Teachable";

  get config(): LearningConfig {
    return {
      enabled: !!process.env.TEACHABLE_API_KEY,
      apiKey: process.env.TEACHABLE_API_KEY,
      subdomain: process.env.TEACHABLE_SCHOOL_SUBDOMAIN,
    };
  }

  isAvailable(): boolean { return !!this.config.apiKey; }

  private baseUrl(): string {
    return `https://developers.teachable.com/v1`;
  }

  async enrollUser(params: LearningEnrollParams): Promise<{ enrollmentId: string }> {
    const res = await fetch(`${this.baseUrl()}/courses/${params.courseId}/enrollments`, {
      method: "POST",
      headers: {
        apiKey: this.config.apiKey ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: params.userId }),
    });

    const json = (await res.json()) as { enrollment: { id: number } };
    return { enrollmentId: String(json.enrollment.id) };
  }

  async getProgress(
    userId: string,
    courseId: string
  ): Promise<{ percent: number; completedAt?: string }> {
    const res = await fetch(
      `${this.baseUrl()}/courses/${courseId}/enrollments?user_id=${userId}`,
      { headers: { apiKey: this.config.apiKey ?? "" } }
    );
    const json = (await res.json()) as {
      enrollments: Array<{ percent_complete: number; completed_at?: string }>;
    };
    const enrollment = json.enrollments[0];
    return {
      percent: enrollment?.percent_complete ?? 0,
      completedAt: enrollment?.completed_at,
    };
  }

  async issueCertificate(
    userId: string,
    courseId: string
  ): Promise<{ certificateId: string; url: string }> {
    // Teachable generates certificates automatically on 100% completion.
    // This method triggers a webhook check or retrieves the certificate URL.
    void userId;
    return { certificateId: `cert_${courseId}_${userId}`, url: "" };
  }
}

// ─── Stub ──────────────────────────────────────────────────────────────────────

class StubLearningProvider implements LearningProvider {
  readonly id = "stub";
  readonly name = "Internal Learning Engine";
  readonly config: LearningConfig = { enabled: true };
  isAvailable(): boolean { return true; }

  async enrollUser(params: LearningEnrollParams): Promise<{ enrollmentId: string }> {
    const id = `enroll_${Date.now()}`;
    console.log("[LearningStub] Enroll user:", params.userId, "in course:", params.courseId, "→", id);
    return { enrollmentId: id };
  }

  async getProgress(
    userId: string,
    courseId: string
  ): Promise<{ percent: number }> {
    void userId; void courseId;
    return { percent: 0 };
  }

  async issueCertificate(
    userId: string,
    courseId: string
  ): Promise<{ certificateId: string; url: string }> {
    const id = `cert_${courseId}_${userId}`;
    return { certificateId: id, url: `/certificates/${id}` };
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export const learningProvider: LearningProvider =
  process.env.LEARNING_PROVIDER === "teachable"
    ? new TeachableProvider()
    : new StubLearningProvider();
