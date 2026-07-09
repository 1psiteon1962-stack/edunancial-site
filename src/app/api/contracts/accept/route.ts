import { NextResponse } from "next/server";

import {
  buildRateLimitKey,
  isRateLimited,
  readJsonBody,
  withApiHeaders,
} from "@/lib/api/security";
import { createContractAcceptanceRecord } from "@/lib/contracts/contractEngine";
import { CONTRACT_TEMPLATES, ContractTemplateKey } from "@/lib/contracts/contractTypes";

type ContractAcceptBody = {
  contractId?: string;
};

export async function POST(req: Request) {
  const key = buildRateLimitKey("contract-acceptance", req);

  if (isRateLimited(key, { limit: 10, windowMs: 60_000 })) {
    return withApiHeaders(
      NextResponse.json(
        { success: false, error: "Too many contract acceptance attempts" },
        { status: 429 }
      )
    );
  }

  const body = await readJsonBody<ContractAcceptBody>(req);
  const contractId = body?.contractId;

  if (!contractId || !(contractId in CONTRACT_TEMPLATES)) {
    return withApiHeaders(
      NextResponse.json(
        { success: false, error: "Unknown contract id" },
        { status: 400 }
      )
    );
  }

  const acceptanceRecord = createContractAcceptanceRecord({
    userId: "anonymous",
    contractKey: contractId as ContractTemplateKey,
  });

  return withApiHeaders(
    NextResponse.json({
      success: true,
      status: "accepted",
      contractId,
      acceptedAt: acceptanceRecord.acceptedAt,
      version: acceptanceRecord.version,
    })
  );
}
