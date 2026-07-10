/**
 * CRM provider adapter.
 *
 * Supports:
 *   - HubSpot  (CRM_PROVIDER=hubspot)
 *   - Stub     (default)
 *
 * Environment variables:
 *   CRM_PROVIDER        – "hubspot" (default: "stub")
 *   HUBSPOT_API_KEY     – HubSpot private app token
 */

import type { CrmProvider, CrmContact, ProviderConfig } from "../types";

export interface CrmConfig extends ProviderConfig {
  apiKey?: string;
}

// ─── HubSpot ──────────────────────────────────────────────────────────────────

class HubSpotProvider implements CrmProvider {
  readonly id = "hubspot";
  readonly name = "HubSpot";

  get config(): CrmConfig {
    return { enabled: !!process.env.HUBSPOT_API_KEY, apiKey: process.env.HUBSPOT_API_KEY };
  }

  isAvailable(): boolean { return !!this.config.apiKey; }

  private headers(): HeadersInit {
    return {
      Authorization: "Bearer " + this.config.apiKey,
      "Content-Type": "application/json",
    };
  }

  async upsertContact(contact: CrmContact): Promise<{ id: string }> {
    const properties: Record<string, string> = {
      email: contact.email,
      ...(contact.firstName ? { firstname: contact.firstName } : {}),
      ...(contact.lastName ? { lastname: contact.lastName } : {}),
      ...(contact.phone ? { phone: contact.phone } : {}),
    };

    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/upsert", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        inputs: [{ properties, id: contact.email, idProperty: "email" }],
      }),
    });

    const json = (await res.json()) as { results: Array<{ id: string }> };
    return { id: json.results[0]?.id ?? "" };
  }

  async getContact(id: string): Promise<CrmContact | null> {
    const res = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${id}?properties=email,firstname,lastname,phone`, {
      headers: this.headers(),
    });

    if (!res.ok) return null;
    const json = (await res.json()) as { id: string; properties: Record<string, string> };
    return {
      id: json.id,
      email: json.properties.email ?? "",
      firstName: json.properties.firstname,
      lastName: json.properties.lastname,
      phone: json.properties.phone,
    };
  }

  async addTag(contactId: string, tag: string): Promise<void> {
    await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: "PATCH",
      headers: this.headers(),
      body: JSON.stringify({ properties: { hs_tag: tag } }),
    });
  }
}

// ─── Stub ──────────────────────────────────────────────────────────────────────

class StubCrmProvider implements CrmProvider {
  readonly id = "stub";
  readonly name = "CRM Stub";
  readonly config: CrmConfig = { enabled: true };
  isAvailable(): boolean { return true; }

  async upsertContact(contact: CrmContact): Promise<{ id: string }> {
    const id = `crm_${Date.now()}`;
    console.log("[CrmStub] Upsert contact:", contact.email, "→", id);
    return { id };
  }

  async getContact(_id: string): Promise<CrmContact | null> { return null; }
  async addTag(contactId: string, tag: string): Promise<void> {
    console.log("[CrmStub] Add tag:", tag, "to", contactId);
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export const crmProvider: CrmProvider =
  process.env.CRM_PROVIDER === "hubspot" ? new HubSpotProvider() : new StubCrmProvider();
