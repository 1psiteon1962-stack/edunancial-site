#!/usr/bin/env node
/**
 * scripts/owner-bootstrap.mjs
 *
 * Owner credential bootstrap utility.
 *
 * Generates a secure scrypt password hash and prints the environment variables
 * needed to configure the Owner and Admin login for Edunancial.
 *
 * Usage:
 *   node scripts/owner-bootstrap.mjs
 *
 * You will be prompted for an email address and password.
 * Copy the output into your .env file or hosting provider's environment variable settings.
 *
 * Security notes:
 * - Never store the raw password — only the generated hash.
 * - Use a strong, unique password (20+ chars recommended).
 * - Store EDUNANCIAL_ADMIN_SESSION_SECRET separately as a random 32+ character string.
 * - Do not commit the generated .env file or hash values to version control.
 */

import { createInterface } from 'node:readline/promises';
import { randomBytes, scryptSync } from 'node:crypto';
import { stdin as input, stdout as output } from 'node:process';

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

function generateSecret(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

async function promptPassword(rl, label) {
  // Hide password input where possible
  const password = await rl.question(`${label}: `);
  return password.trim();
}

const rl = createInterface({ input, output });

console.log('\n=== Edunancial Owner Bootstrap ===\n');
console.log('This utility generates secure credential hashes for the Owner and Admin accounts.');
console.log('You will be prompted for the email and password for EACH role.\n');

try {
  // Owner credentials
  console.log('--- OWNER ACCOUNT ---');
  const ownerEmail = (await rl.question('Owner email address: ')).trim().toLowerCase();
  if (!ownerEmail.includes('@')) {
    console.error('ERROR: Invalid email address.');
    process.exit(1);
  }
  const ownerPassword = await promptPassword(rl, 'Owner password (will be hashed)');
  if (ownerPassword.length < 12) {
    console.error('ERROR: Password must be at least 12 characters.');
    process.exit(1);
  }
  const ownerHash = hashPassword(ownerPassword);

  // Admin credentials
  console.log('\n--- ADMIN ACCOUNT ---');
  const adminEmail = (await rl.question('Admin email address (can be same as owner): ')).trim().toLowerCase();
  if (!adminEmail.includes('@')) {
    console.error('ERROR: Invalid email address.');
    process.exit(1);
  }
  const adminPassword = await promptPassword(rl, 'Admin password (will be hashed)');
  if (adminPassword.length < 12) {
    console.error('ERROR: Password must be at least 12 characters.');
    process.exit(1);
  }
  const adminHash = hashPassword(adminPassword);

  // Session secret
  const sessionSecret = generateSecret(48);

  rl.close();

  console.log('\n=== GENERATED ENVIRONMENT VARIABLES ===\n');
  console.log('Copy the following into your .env file or hosting provider settings.');
  console.log('NEVER commit these values to version control.\n');
  console.log('# Owner account (full access — bypasses all paywalls)');
  console.log(`EDUNANCIAL_OWNER_EMAIL=${ownerEmail}`);
  console.log(`EDUNANCIAL_OWNER_PASSWORD_HASH=${ownerHash}`);
  console.log('');
  console.log('# Admin account (content management access)');
  console.log(`EDUNANCIAL_ADMIN_EMAIL=${adminEmail}`);
  console.log(`EDUNANCIAL_ADMIN_PASSWORD_HASH=${adminHash}`);
  console.log('');
  console.log('# Session signing secret (keep this private and stable)');
  console.log(`EDUNANCIAL_ADMIN_SESSION_SECRET=${sessionSecret}`);
  console.log('\n=== IMPORTANT ===');
  console.log('Store the raw passwords in a secure password manager.');
  console.log('The hash values above are what go in the environment variables.');
  console.log('The raw passwords are NOT recoverable from the hashes.\n');
} catch (err) {
  rl.close();
  if (err.code === 'ERR_USE_AFTER_CLOSE') {
    // User pressed Ctrl+C
    console.log('\nCancelled.');
    process.exit(0);
  }
  throw err;
}
