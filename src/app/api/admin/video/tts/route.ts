import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";

const DEFAULT_MODEL = process.env.EDUNANCIAL_TTS_MODEL?.trim() || "gpt-4o-mini-tts";
const ALLOWED_VOICES = new Set([
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "nova",
  "onyx",
  "sage",
  "shimmer",
]);
const MAX_SCRIPT_CHARS = 4000;

function normalizeLocale(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return "en-US";
  if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/u.test(raw)) return null;
  return raw;
}

function localeInstruction(locale: string) {
  const names: Record<string, string> = {
    "en-US": "American English",
    "en-GB": "British English",
    "es-US": "United States Spanish",
    "es-PR": "Puerto Rican Spanish",
    "es-DO": "Dominican Spanish",
    "es-MX": "Mexican Spanish",
    "es-ES": "Spain Spanish",
    "fr-CA": "Canadian French",
    "fr-FR": "France French",
    "pt-BR": "Brazilian Portuguese",
    "pt-PT": "European Portuguese",
    "de-DE": "German",
    "it-IT": "Italian",
    "nl-NL": "Dutch",
    "ja-JP": "Japanese",
    "ko-KR": "Korean",
    "sw-UG": "East African Swahili",
    "ar-SA": "Modern Standard Arabic",
  };
  return names[locale] ?? locale;
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "Text-to-speech is not configured. OPENAI_API_KEY is missing." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null) as {
    script?: unknown;
    locale?: unknown;
    voice?: unknown;
  } | null;

  const script = String(body?.script ?? "").trim();
  const locale = normalizeLocale(body?.locale);
  const voice = String(body?.voice ?? "coral").trim().toLowerCase();

  if (!script) {
    return NextResponse.json({ success: false, error: "Narration script is required." }, { status: 400 });
  }
  if (script.length > MAX_SCRIPT_CHARS) {
    return NextResponse.json(
      { success: false, error: `Narration script must be ${MAX_SCRIPT_CHARS} characters or fewer.` },
      { status: 400 },
    );
  }
  if (!locale) {
    return NextResponse.json({ success: false, error: "Invalid narration locale." }, { status: 400 });
  }
  if (!ALLOWED_VOICES.has(voice)) {
    return NextResponse.json({ success: false, error: "Unsupported narration voice." }, { status: 400 });
  }

  const speechResponse = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      voice,
      input: script,
      response_format: "mp3",
      instructions: `Speak naturally in ${localeInstruction(locale)}. Preserve the meaning and wording of the supplied script. Use a clear, confident educational and marketing delivery. Do not translate the script.`,
    }),
  });

  if (!speechResponse.ok) {
    const detail = await speechResponse.text().catch(() => "");
    console.error("video.tts.provider_failed", { status: speechResponse.status, detail: detail.slice(0, 500) });
    return NextResponse.json(
      { success: false, error: "Text-to-speech generation failed." },
      { status: 502 },
    );
  }

  const audio = await speechResponse.arrayBuffer();
  return new Response(audio, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename="edunancial-narration-${locale}.mp3"`,
      "Cache-Control": "no-store, private",
      "X-Edunancial-TTS-Locale": locale,
      "X-Edunancial-TTS-Voice": voice,
    },
  });
}
