import { NextResponse } from "next/server";

import { generateJurisdictionLessonResponse } from "@/lib/ai-learning/jurisdiction-service";

type RequestPayload = {
  message?: string;
  lessonId?: string;
  displayLanguage?: string;
  learningJurisdiction?: string;
  learnerLocation?: string | null;
  sourceJurisdiction?: string;
};

export async function POST(request: Request) {
  let payload: RequestPayload;
  try {
    payload = (await request.json()) as RequestPayload;
  } catch {
    return NextResponse.json({ enabled: false, message: "Invalid request body." }, { status: 400 });
  }

  const message = payload.message?.trim();
  const lessonId = payload.lessonId?.trim().toUpperCase();
  const displayLanguage = payload.displayLanguage?.trim();
  const learningJurisdiction = payload.learningJurisdiction?.trim();

  if (!message || !lessonId || !displayLanguage || !learningJurisdiction) {
    return NextResponse.json(
      {
        enabled: false,
        message: "message, lessonId, displayLanguage, and learningJurisdiction are required.",
      },
      { status: 400 },
    );
  }

  if (!/^[A-Z0-9-]{3,30}$/.test(lessonId) || message.length > 4000) {
    return NextResponse.json({ enabled: false, message: "Invalid lesson or message." }, { status: 400 });
  }

  const response = await generateJurisdictionLessonResponse({
    message,
    lessonId,
    displayLanguage,
    learningJurisdiction,
    learnerLocation: payload.learnerLocation,
    sourceJurisdiction: payload.sourceJurisdiction,
  });

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
