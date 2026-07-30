#!/usr/bin/env node
/**
 * scripts/curriculum/add-lesson.mjs
 *
 * Interactive helper to scaffold a new lesson markdown file and optionally import it.
 *
 * Usage:
 *   npm run curriculum:add-lesson
 *   npm run curriculum:add-lesson -- --track RED --level 1 --number 11 --title "Your Title"
 *
 * The script creates a properly formatted markdown file that passes all validator checks.
 * After creation, it optionally runs the import to register the lesson immediately.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../..');

const TRACKS = {
  RED: 'Real Estate',
  WHITE: 'Paper Assets',
  BLUE: 'Business',
  GREEN: 'Taxes',
  GOLD: 'Investing',
  PURPLE: 'Law',
  ORANGE: 'Sales & Marketing',
  BLACK: 'Leadership & Executive Management',
};

const VALID_TRACKS = Object.keys(TRACKS);

const args = process.argv.slice(2);

function getArg(flag) {
  const idx = args.indexOf(flag);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return null;
}

async function prompt(rl, question, defaultValue) {
  const suffix = defaultValue ? ` [${defaultValue}]: ` : ': ';
  const answer = await rl.question(question + suffix);
  return answer.trim() || defaultValue || '';
}

async function main() {
  console.log('\n=== Curriculum Lesson Creator ===\n');
  console.log('This tool creates a properly formatted lesson file and imports it.\n');

  let track = getArg('--track')?.toUpperCase();
  let level = getArg('--level');
  let number = getArg('--number');
  let title = getArg('--title');
  let autoImport = args.includes('--import') || args.includes('-y');

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    // Track
    if (!track || !VALID_TRACKS.includes(track)) {
      console.log('Available tracks:', VALID_TRACKS.join(', '));
      const answer = await prompt(rl, 'Track code', 'RED');
      track = answer.toUpperCase();
      if (!VALID_TRACKS.includes(track)) {
        console.error(`Invalid track: ${track}`);
        process.exit(1);
      }
    }

    // Level
    if (!level || isNaN(parseInt(level, 10))) {
      level = await prompt(rl, 'Level number (1–9)', '1');
    }
    level = parseInt(level, 10);
    if (isNaN(level) || level < 1 || level > 9) {
      console.error('Level must be between 1 and 9');
      process.exit(1);
    }

    // Lesson number
    // Auto-detect next number from registry
    let autoNumber = null;
    try {
      const registryPath = resolve(REPO_ROOT, 'curriculum', 'registry.json');
      if (existsSync(registryPath)) {
        const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
        const levelData = registry.tracks?.[track]?.levels?.[String(level)];
        if (levelData?.assets) {
          const lessonNumbers = Object.values(levelData.assets)
            .filter(a => a.type === 'lesson' && typeof a.lessonNumber === 'number')
            .map(a => a.lessonNumber);
          if (lessonNumbers.length > 0) {
            autoNumber = Math.max(...lessonNumbers) + 1;
          } else {
            autoNumber = 1;
          }
        } else {
          autoNumber = 1;
        }
      }
    } catch (_) { /* ignore */ }

    if (!number || isNaN(parseInt(number, 10))) {
      number = await prompt(rl, 'Lesson number', autoNumber ? String(autoNumber) : '');
    }
    number = parseInt(number, 10);
    if (isNaN(number) || number < 1) {
      console.error('Lesson number must be a positive integer');
      process.exit(1);
    }

    // Title
    if (!title) {
      title = await prompt(rl, 'Lesson title', '');
      if (!title) {
        console.error('Title is required');
        process.exit(1);
      }
    }

    // Summary
    const summary = await prompt(rl, 'Brief summary (one or two sentences)', '');

    // Auto-import prompt
    if (!autoImport) {
      const answer = await prompt(rl, 'Import immediately after creation? (y/n)', 'y');
      autoImport = answer.toLowerCase().startsWith('y');
    }

    // Generate ID and file
    const numberStr = String(number).padStart(3, '0');
    const id = `${track}-L${level}-${numberStr}`;
    const filePath = resolve(REPO_ROOT, 'content', 'curriculum', track, `L${level}`, `${id}.md`);
    const today = new Date().toISOString().slice(0, 10);
    const officialTrackName = TRACKS[track];

    const content = `---
id: ${id}
track: ${track}
officialTrackName: ${officialTrackName}
level: ${level}
lessonNumber: ${number}
title: ${title}
version: 1.0
author: Edunancial Faculty
date: ${today}
summary: ${summary || title}
---

## Learning Objectives

By the end of this lesson you will be able to:

- [Add learning objective 1]
- [Add learning objective 2]
- [Add learning objective 3]

## Core Content

[Add the lesson content here]

### Section 1

[Section content]

### Section 2

[Section content]

## Application

[Add practical application exercise here]
`;

    // Write file
    mkdirSync(dirname(filePath), { recursive: true });
    if (existsSync(filePath)) {
      console.error(`\nFile already exists: ${filePath}`);
      console.error('To update an existing lesson, use: npm run curriculum:import -- ' + filePath);
      process.exit(1);
    }
    writeFileSync(filePath, content, 'utf8');
    console.log(`\n✅ Created: ${filePath}`);
    console.log(`   Lesson ID: ${id}`);
    console.log(`   URL (after import): /curriculum/${track.toLowerCase()}/l${level}/${id.toLowerCase()}`);

    if (autoImport) {
      console.log('\n📦 Importing lesson...\n');
      execSync(`npm run curriculum:import -- "${filePath}"`, {
        stdio: 'inherit',
        cwd: REPO_ROOT,
      });
      console.log(`\n✅ Lesson ${id} is now live at: /curriculum/${track.toLowerCase()}/l${level}/${id.toLowerCase()}`);
    } else {
      console.log(`\nTo import this lesson, run:\n  npm run curriculum:import -- "${filePath}"\n`);
    }
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
