/**
 * POST /api/v1/auth/revoke
 *
 * Revoke the current access or refresh token.
 * Also supports revoking all tokens for the authenticated user.
 */

import { parseAndValidate } from "@/lib/api/validation";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/lib/api/rate-limit";
import { handleError } from "@/lib/api/errors";
import { success } from "@/lib/api/response";
import { requireJwt } from "@/lib/auth/jwt";
import { revokeToken, revokeAllUserTokens } from "@/lib/auth/token-store";
import { audit } from "@/lib/monitoring/audit";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    await enforceRateLimit(request, { ...RATE_LIMIT_PRESETS.auth, keyPrefix: "auth.revoke" });

    const claims = await requireJwt(request);

    const body = await parseAndValidate<{ revoke_all?: boolean; token?: string }>(
      request.clone(),
      {
        revoke_all: { type: "boolean" },
        token: { type: "string" },
      }
    ).catch(() => ({ revoke_all: false, token: undefined }));

    if (body.revoke_all) {
      await revokeAllUserTokens(claims.sub);
      audit("auth.token_revoked", {
        actorId: claims.sub,
        actorType: "user",
        result: "success",
        metadata: { revokeAll: true },
      });
      return success({ revoked: "all" });
    }

    if (claims.jti) {
      const exp = claims.exp ? claims.exp * 1000 : Date.now() + 86_400_000;
      await revokeToken(claims.jti, claims.sub, exp);
    }

    audit("auth.token_revoked", {
      actorId: claims.sub,
      actorType: "user",
      result: "success",
      metadata: { jti: claims.jti },
    });

    return success({ revoked: true });
  } catch (err) {
    return handleError(err);
  }
}
