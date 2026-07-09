export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateString(
  value: unknown,
  options: {
    allowedValues?: readonly string[];
    field: string;
    maxLength?: number;
    minLength?: number;
  }
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (options.minLength && normalized.length < options.minLength) {
    return null;
  }

  if (options.maxLength && normalized.length > options.maxLength) {
    return null;
  }

  if (options.allowedValues && !options.allowedValues.includes(normalized)) {
    return null;
  }

  return normalized;
}

export function validateNumber(
  value: unknown,
  options: {
    max?: number;
    min?: number;
  } = {}
): number | null {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  if (typeof options.min === "number" && value < options.min) {
    return null;
  }

  if (typeof options.max === "number" && value > options.max) {
    return null;
  }

  return value;
}

export async function readJsonBody(
  request: Request
): Promise<Record<string, unknown> | null> {
  const body = (await request.json()) as unknown;
  return isRecord(body) ? body : null;
}
