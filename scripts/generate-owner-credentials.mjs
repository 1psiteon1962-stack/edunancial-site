#!/usr/bin/env node
/**
 * generate-owner-credentials.mjs
 *
 * Interactive CLI utility to generate a secure scrypt password hash for the
 * Owner (or Administrator) account environment variable.
 *
 * Usage:
 *   node scripts/generate-owner-credentials.mjs
 *
 * The script will prompt for a password, hash it with scrypt, and print the
 * value to copy into your deployment environment variable:
 *
 *   EDUNANCIAL_OWNER_PASSWORD_HASH=scrypt$<salt>$<hash>
 *   EDUNANCIAL_ADMIN_PASSWORD_HASH=scrypt$<salt>$<hash>
 *
 * IMPORTANT: Never commit the resulting hash values to source control.
 * Set them as secret environment variables in your deployment platform.
 */

import { createInterface } from "node:readline";
import { randomBytes, scryptSync } from "node:crypto";

const rl = createInterface({ input: process.stdin, output: process.stdout });

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║         Edunancial — Owner Credentials Generator            ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  console.log("This script generates a secure scrypt password hash for the");
  console.log("Owner (super administrator) or Administrator account.\n");
  console.log("⚠  IMPORTANT: Do NOT commit the generated hash to the repository.");
  console.log("   Set it as a secret environment variable in your deployment.\n");

  const accountType = await question(
    "Which account are you setting up? [owner/admin] (default: owner): ",
  );
  const isOwner = accountType.trim().toLowerCase() !== "admin";
  const label = isOwner ? "Owner" : "Administrator";
  const envVar = isOwner
    ? "EDUNANCIAL_OWNER_PASSWORD_HASH"
    : "EDUNANCIAL_ADMIN_PASSWORD_HASH";
  const emailEnvVar = isOwner ? "EDUNANCIAL_OWNER_EMAIL" : "EDUNANCIAL_ADMIN_EMAIL";

  const email = await question(`Enter the ${label} email address: `);
  if (!email.includes("@")) {
    console.error("❌  Invalid email address.");
    process.exit(1);
  }

  const password = await question(`Enter the ${label} password (input is visible): `);
  if (password.length < 12) {
    console.error("❌  Password must be at least 12 characters.");
    process.exit(1);
  }

  const confirmPassword = await question("Confirm password: ");
  if (password !== confirmPassword) {
    console.error("❌  Passwords do not match.");
    process.exit(1);
  }

  rl.close();

  const hash = hashPassword(password);

  console.log("\n✅  Credentials generated successfully!\n");
  console.log("Add the following to your deployment environment variables:");
  console.log("─".repeat(64));
  console.log(`${emailEnvVar}=${email.trim()}`);
  console.log(`${envVar}=${hash}`);
  console.log("─".repeat(64));

  if (isOwner) {
    console.log("\nAlso ensure these are set:");
    console.log(
      "EDUNANCIAL_ADMIN_SESSION_SECRET=<generate with: node -e \"require('crypto').randomBytes(32).toString('hex')\" | pbcopy>",
    );
  }

  console.log(
    "\n⚠  Store these values in your secret manager (Netlify, Vercel, etc.).",
  );
  console.log("   They must never be committed to the repository.\n");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
