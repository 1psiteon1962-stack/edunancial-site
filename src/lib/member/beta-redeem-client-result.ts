/**
 * Browser-only presentation of a redemption response. A lost response is not
 * evidence that the atomic one-use grant failed: never automatically retry it.
 */
export const BETA_REDEEM_UNCERTAIN_MESSAGE =
  "We could not confirm activation. Your code may already have been redeemed. Check your curriculum access before trying again, or contact support.";

const BETA_REDEEM_SUCCESS_MESSAGE =
  "Beta access activated. You can now view the available curriculum.";
const BETA_REDEEM_GENERIC_MESSAGE =
  "That access code could not be redeemed.";

export type BetaRedeemClientResult = {
  state: "success" | "error" | "uncertain";
  message: string;
};

export async function classifyBetaRedeemHttpResponse(
  response: Pick<Response, "ok" | "status" | "json">,
): Promise<BetaRedeemClientResult> {
  let payload: unknown = null;
  try { payload = await response.json(); } catch { /* A 201 is still a success even if JSON is lost. */ }
  const record = payload && typeof payload === "object" && !Array.isArray(payload)
    ? payload as Record<string, unknown> : {};

  if (response.ok) {
    return {
      state: "success",
      message: typeof record.message === "string" && record.message.trim()
        ? record.message : BETA_REDEEM_SUCCESS_MESSAGE,
    };
  }

  // Definitive client failures cannot have committed a new successful redemption.
  if ([400, 401, 403, 409, 429].includes(response.status)) {
    return {
      state: "error",
      message: typeof record.error === "string" && record.error.trim()
        ? record.error : BETA_REDEEM_GENERIC_MESSAGE,
    };
  }

  // 5xx or unexpected status can occur AFTER Neon committed the single-use UPDATE.
  return { state: "uncertain", message: BETA_REDEEM_UNCERTAIN_MESSAGE };
}
