/**
 * POST /api/v1/auth/refresh
 *
 * Exchange a valid refresh token for a new access token.
 */

import { parseAndValidate } from "@/lib/api/validation";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/lib/api/rate-limit";
import { handleError, ApiError } from "@/lib/api/errors";
import { success } from "@/lib/api/response";
import { verifyJwt, createAccessToken } from "@/lib/auth/jwt";
import { isTokenRevoked } from "@/lib/auth/token-store";
import { audit } from "@/lib/monitoring/audit";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    await enforceRateLimit(request, { ...RATE_LIMIT_PRESETS.auth, keyPrefix: "auth.refresh" });

    const body = await parseAndValidate<{ refresh_token: string }>(request, {
      refresh_token: { required: true, type: "string" },
    });

    const claims = await verifyJwt(body.refresh_token);

    if (claims.type !== "refresh") {
      throw ApiError.unauthorized("Token is not a refresh token");
    }

    if (claims.jti && await isTokenRevoked(claims.jti)) {
      throw new ApiError("TOKEN_REVOKED" as never, "Refresh token has been revoked", 401);
    }

    const accessToken = await createAccessToken(
      claims.sub,
      claims.roles ?? [],
      claims.scopes ?? []
    );

    audit("auth.token_issued", {
      actorId: claims.sub,
      actorType: "user",
      result: "success",
      metadata: { grantType: "refresh_token", jti: claims.jti },
    });

    return success({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: parseInt(process.env.JWT_ACCESS_TTL_S ?? "900", 10),
    });
  } catch (err) {
    return handleError(err);
  }
}
