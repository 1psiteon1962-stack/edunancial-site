import { PASSWORD_POLICY } from "@/lib/passwordPolicy";

export function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < PASSWORD_POLICY.minimumLength) {
    errors.push(`At least ${PASSWORD_POLICY.minimumLength} characters`);
  }
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("At least one uppercase letter");
  }
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("At least one lowercase letter");
  }
  if (PASSWORD_POLICY.requireNumber && !/[0-9]/.test(password)) {
    errors.push("At least one number");
  }
  if (PASSWORD_POLICY.requireSpecialCharacter && !/[^A-Za-z0-9]/.test(password)) {
    errors.push("At least one special character (!@#$%^&*)");
  }
  return errors;
}
