#!/usr/bin/env node
/**
 * scripts/bootstrap-owner.mjs
 *
 * Generates secure scrypt password hashes for the Owner/Admin credentials.
 * Run once at initial deployment and store output in your hosting environment
 * variables — never commit these values to source control.
 *
 * Usage:
 *   node scripts/bootstrap-owner.mjs
 *
 * You will be prompted for a role (owner or admin) and password.
 * The output is the hashed value to set as the environment variable.
 */

import { createInterface } from 'node:readline/promises';
import { randomBytes, scryptSync } from 'node:crypto';
import { stdin as input, stdout as output } from 'node:process';

const rl = createInterface({ input, output });

console.log('\n=== Edunancial Owner/Admin Bootstrap Tool ===\n');
console.log('This tool generates a secure scrypt password hash for environment variable configuration.');
console.log('NEVER commit the output to source control. Set it as a secret env var in your host.\n');

const role = (await rl.question('Role to configure [owner/admin] (default: owner): ')).trim().toLowerCase() || 'owner';
if (role !== 'owner' && role !== 'admin') {
  console.error('Invalid role. Use "owner" or "admin".');
  rl.close();
  process.exit(1);
}

const password = (await rl.question(`Password for ${role} account: `)).trim();
if (!password || password.length < 12) {
  console.error('Password must be at least 12 characters.');
  rl.close();
  process.exit(1);
}

const email = (await rl.question(`Email for ${role} account: `)).trim().toLowerCase();
if (!email.includes('@')) {
  console.error('Please provide a valid email address.');
  rl.close();
  process.exit(1);
}

rl.close();

const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64).toString('hex');
const storedHash = `scrypt$${salt}$${hash}`;

const envEmail = role === 'owner' ? 'EDUNANCIAL_OWNER_EMAIL' : 'EDUNANCIAL_ADMIN_EMAIL';
const envHash = role === 'owner' ? 'EDUNANCIAL_OWNER_PASSWORD_HASH' : 'EDUNANCIAL_ADMIN_PASSWORD_HASH';

console.log('\n=== Generated Environment Variables ===\n');
console.log(`${envEmail}=${email}`);
console.log(`${envHash}=${storedHash}`);
console.log('\n⚠️  Set these as SECRET environment variables in your hosting platform.');
console.log('⚠️  Do NOT commit these values to source control.');
if (role === 'owner') {
  console.log('\nOwner login URL: /executive/login');
  console.log('Owner capabilities: bypass all paywalls, full CMS access, all admin functions.');
} else {
  console.log('\nAdmin login URL: /admin/login');
  console.log('Admin capabilities: full CMS access, course management, user management.');
}
console.log('');
