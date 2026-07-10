/**
 * Analytics provider adapters.
 *
 * Google Analytics 4 (Measurement Protocol)
 * Google Search Console (Data API)
 * Microsoft Clarity
 *
 * Environment variables:
 *   GA4_MEASUREMENT_ID       – GA4 Measurement ID (G-XXXXXXXXXX)
 *   GA4_API_SECRET           – GA4 Measurement Protocol API secret
 *   GSC_SERVICE_ACCOUNT_KEY  – JSON service account key for GSC
 *   CLARITY_PROJECT_ID       – Microsoft Clarity project ID
 */

import type { AnalyticsProvider, ProviderConfig, TrackEventParams } from "../types";

// ─── Google Analytics 4 ───────────────────────────────────────────────────────

export interface GA4Config extends ProviderConfig {
  measurementId: string;
  apiSecret: string;
}

class GoogleAnalyticsProvider implements AnalyticsProvider {
  readonly id = "google-analytics";
  readonly name = "Google Analytics 4";

  get config(): GA4Config {
    return {
      enabled: !!(process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET),
      measurementId: process.env.GA4_MEASUREMENT_ID ?? "",
      apiSecret: process.env.GA4_API_SECRET ?? "",
    };
  }

  isAvailable(): boolean {
    return !!(this.config.measurementId && this.config.apiSecret);
  }

  async track(params: TrackEventParams): Promise<void> {
    if (!this.isAvailable()) return;

    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${this.config.measurementId}&api_secret=${this.config.apiSecret}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: params.anonymousId ?? params.userId ?? "server",
          user_id: params.userId,
          timestamp_micros: params.timestamp
            ? new Date(params.timestamp).getTime() * 1000
            : undefined,
          events: [
            {
              name: params.name,
              params: params.properties ?? {},
            },
          ],
        }),
      }
    );
  }

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    await this.track({
      name: "user_identify",
      userId,
      properties: traits,
    });
  }

  async page(name: string, properties?: Record<string, unknown>): Promise<void> {
    await this.track({ name: "page_view", properties: { page_title: name, ...properties } });
  }
}

// ─── Google Search Console ────────────────────────────────────────────────────

export class GoogleSearchConsoleProvider {
  readonly id = "google-search-console";
  readonly name = "Google Search Console";

  isAvailable(): boolean {
    return !!process.env.GSC_SERVICE_ACCOUNT_KEY;
  }

  /**
   * Fetch search analytics for a site.
   * Requires OAuth 2.0 service account or user delegation.
   * Returns stub data when credentials are not configured.
   */
  async getSearchAnalytics(
    siteUrl: string,
    params: {
      startDate: string;
      endDate: string;
      dimensions?: string[];
    }
  ): Promise<{ rows: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> }> {
    if (!this.isAvailable()) {
      return { rows: [] };
    }

    // Production: Use the Google APIs Node client with service account auth.
    // Placeholder to document the interface.
    void siteUrl;
    void params;
    return { rows: [] };
  }
}

// ─── Microsoft Clarity ───────────────────────────────────────────────────────

export class MicrosoftClarityProvider {
  readonly id = "microsoft-clarity";
  readonly name = "Microsoft Clarity";

  isAvailable(): boolean {
    return !!process.env.CLARITY_PROJECT_ID;
  }

  /**
   * Returns the Clarity script tag snippet for server-side rendering.
   */
  getScriptSnippet(): string {
    const projectId = process.env.CLARITY_PROJECT_ID ?? "";
    if (!projectId) return "";
    return `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`;
  }
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export const googleAnalyticsProvider = new GoogleAnalyticsProvider();
export const googleSearchConsoleProvider = new GoogleSearchConsoleProvider();
export const microsoftClarityProvider = new MicrosoftClarityProvider();
