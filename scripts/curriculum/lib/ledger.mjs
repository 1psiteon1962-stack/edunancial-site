// scripts/curriculum/lib/ledger.mjs
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { LEDGER_PATH } from './paths.mjs';

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function readLedger() {
  if (!existsSync(LEDGER_PATH)) {
    return {
      _schema: 'curriculum/schemas/ledger.schema.json',
      _version: '1.0',
      _note: 'Append-only ingestion ledger. Each import/update/rejection is recorded here.',
      entries: [],
    };
  }
  return JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
}

export function writeLedger(ledger) {
  ledger._schema ||= 'curriculum/schemas/ledger.schema.json';
  ledger._version ||= '1.0';
  ledger._note ||= 'Append-only ingestion ledger. Each import/update/rejection is recorded here.';
  ensureDir(LEDGER_PATH);
  writeFileSync(LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
}

export function appendLedgerEntry(entry) {
  const ledger = readLedger();
  const fullEntry = {
    ingestionId: entry.ingestionId || randomUUID(),
    timestamp: entry.timestamp || new Date().toISOString(),
    ...entry,
  };
  ledger.entries.push(fullEntry);
  writeLedger(ledger);
  return fullEntry;
}

export function findByAssetId(ledger, assetId) {
  return ledger.entries.filter((entry) => entry.assetId === assetId);
}
