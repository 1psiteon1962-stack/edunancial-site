/**
 * POST /api/v1/auth/token
 *
 * Issue JWT access + refresh tokens.
 * Accepts:
 *   - grant_type: "password" (userId + password stub)
 *   - grant_type: "api_key" (x-api-key header)
 *   - grant_type: "client_credentials" (service account id + secret)
 */

import { parseAndValidate } from "@/lib/api/validation";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/lib/api/rate-limit";
import { handleError } from "@/lib/api/errors";
import { success, apiError } from "@/lib/api/response";
import { createAccessToken, createRefreshToken } from "@/lib/auth/jwt";
import { verifyApiKey } from "@/lib/auth/api-key";
import { audit } from "@/lib/monitoring/audit";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    await enforceRateLimit(request, { ...RATE_LIMIT_PRESETS.auth, keyPrefix: "auth.token" });

    const body = await parseAndValidate<{
      grant_type: string;
      user_id?: string;
      client_id?: string;
    }>(request, {
      grant_type: { required: true, type: "string", enum: ["password", "api_key", "client_credentials"] },
      user_id: { type: "string" },
      client_id: { type: "string" },
    });

    let sub: string;
    let roles: string[] = [];
    let scopes: string[] = [];

    switch (body.grant_type) {
      case "api_key": {
        const record = await verifyApiKey(request);
        sub = record.ownerId;
        scopes = record.scopes;
        audit("auth.token_issued", {
          actorId: sub,
          actorType: "api_key",
          result: "success",
          metadata: { grantType: "api_key", keyId: record.id },
        });
        break;
      }

      case "password": {
        // In production: validate credentials against your user store.
        if (!body.user_id) {
          return apiError("VALIDATION_ERROR", "user_id is required for password grant", { status: 422 });
        }
        sub = body.user_id;
        roles = ["member"];
        audit("auth.token_issued", {
          actorId: sub,
          actorType: "user",
          result: "success",
          metadata: { grantType: "password" },
        });
        break;
      }

      case "client_credentials": {
        if (!body.client_id) {
          return apiError("VALIDATION_ERROR", "client_id is required for client_credentials grant", { status: 422 });
        }
        sub = body.client_id;
        scopes = ["*"];
        audit("auth.token_issued", {
          actorId: sub,
          actorType: "service",
          result: "success",
          metadata: { grantType: "client_credentials" },
        });
        break;
      }

      default:
        return apiError("BAD_REQUEST", "Unsupported grant_type", { status: 400 });
    }

    const [accessToken, refreshToken] = await Promise.all([
      createAccessToken(sub, roles, scopes),
      createRefreshToken(sub),
    ]);

    return success({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: parseInt(process.env.JWT_ACCESS_TTL_S ?? "900", 10),
    });
  } catch (err) {
    return handleError(err);
  }
}
