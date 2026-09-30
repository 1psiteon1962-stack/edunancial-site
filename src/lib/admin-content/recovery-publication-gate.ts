export function recoveryPublicationEnabled(env = process.env) {
  return env.EDUNANCIAL_ENABLE_CURRICULUM_RECOVERY?.trim().toLowerCase() === "true";
}
