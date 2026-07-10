/**
 * Request validation utilities using structural type checks.
 * Avoids adding a heavy schema validation dependency; can be replaced with
 * zod or yup without changing call sites.
 */

import { ApiError } from "./errors";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FieldRule = {
  required?: boolean;
  type?: "string" | "number" | "boolean" | "object" | "array";
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: readonly unknown[];
};

export type Schema = Record<string, FieldRule>;

export interface ValidationError {
  field: string;
  message: string;
}

// ─── Validator ────────────────────────────────────────────────────────────────

/**
 * Validate an object against a simple field-rule schema.
 * Throws `ApiError` (validation) if any rule fails.
 */
export function validate<T extends Record<string, unknown>>(
  data: unknown,
  schema: Schema
): T {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw ApiError.validation("Request body must be a JSON object");
  }

  const body = data as Record<string, unknown>;
  const errors: ValidationError[] = [];

  for (const [field, rule] of Object.entries(schema)) {
    const value = body[field];
    const present = value !== undefined && value !== null;

    if (rule.required && !present) {
      errors.push({ field, message: `${field} is required` });
      continue;
    }

    if (!present) continue;

    if (rule.type) {
      const actualType = Array.isArray(value) ? "array" : typeof value;
      if (actualType !== rule.type) {
        errors.push({
          field,
          message: `${field} must be of type ${rule.type}`,
        });
        continue;
      }
    }

    if (rule.type === "string" && typeof value === "string") {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push({
          field,
          message: `${field} must be at least ${rule.minLength} characters`,
        });
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push({
          field,
          message: `${field} must be at most ${rule.maxLength} characters`,
        });
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push({
          field,
          message: `${field} has an invalid format`,
        });
      }
    }

    if (rule.type === "number" && typeof value === "number") {
      if (rule.min !== undefined && value < rule.min) {
        errors.push({ field, message: `${field} must be >= ${rule.min}` });
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push({ field, message: `${field} must be <= ${rule.max}` });
      }
    }

    if (rule.enum && !rule.enum.includes(value)) {
      errors.push({
        field,
        message: `${field} must be one of: ${rule.enum.join(", ")}`,
      });
    }
  }

  if (errors.length > 0) {
    throw ApiError.validation("Validation failed", errors);
  }

  return body as T;
}

/**
 * Safely parse request JSON and validate it against a schema.
 */
export async function parseAndValidate<T extends Record<string, unknown>>(
  request: Request,
  schema: Schema
): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw ApiError.validation("Request body must be valid JSON");
  }
  return validate<T>(body, schema);
}
