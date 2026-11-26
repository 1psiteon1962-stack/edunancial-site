import type { AuthoritySource, JurisdictionRule } from "./types";
import {
  CONSUMPTION_TAX_ARCHETYPES,
  ENTITY_ARCHETYPES,
  isJurisdictionTopic,
  type ConsumptionTaxArchetype,
  type EntityArchetype,
} from "./topics";

/**
 * A country (or subdivision) fact sheet, authored in Git at
 * content/jurisdictions/<CODE>/fact-sheet.json and reviewed by PR.
 * Only verified, sourced, effective-dated rules are ever given to the AI.
 */
export interface LocalEntityForm {
  /** Local legal name, e.g. "Sociedad de Responsabilidad Limitada". */
  localName: string;
  abbreviation?: string;
  archetype: EntityArchetype;
  sourceIds: string[];
}

export interface ConsumptionTaxSummary {
  localName: string;
  abbreviation?: string;
  archetype: ConsumptionTaxArchetype;
  sourceIds: string[];
}

export interface JurisdictionFactSheet {
  code: string;
  name: string;
  subdivisionCode?: string;
  /** ISO date the whole sheet was last reviewed. */
  lastReviewedAt: string;
  reviewedBy?: string;
  sources: AuthoritySource[];
  entityForms: LocalEntityForm[];
  consumptionTaxes: ConsumptionTaxSummary[];
  rules: JurisdictionRule[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

/** Returns a list of problems; empty means the sheet is structurally valid. */
export function validateFactSheet(sheet: JurisdictionFactSheet): string[] {
  const problems: string[] = [];
  if (!/^[A-Z]{2}(-[A-Z0-9]{1,3})?$/.test(sheet.code)) problems.push(`invalid code "${sheet.code}"`);
  if (!sheet.name?.trim()) problems.push("missing name");
  if (!ISO_DATE.test(sheet.lastReviewedAt ?? "")) problems.push("lastReviewedAt must be an ISO date");

  const sourceIds = new Set<string>();
  for (const source of sheet.sources ?? []) {
    if (sourceIds.has(source.id)) problems.push(`duplicate source id ${source.id}`);
    sourceIds.add(source.id);
    if (!/^https:\/\//.test(source.url)) problems.push(`source ${source.id} must use an https URL`);
  }

  const checkSources = (label: string, ids: string[]) => {
    if (!ids?.length) problems.push(`${label} has no sources`);
    for (const id of ids ?? []) if (!sourceIds.has(id)) problems.push(`${label} cites unknown source ${id}`);
  };

  for (const form of sheet.entityForms ?? []) {
    if (!(ENTITY_ARCHETYPES as readonly string[]).includes(form.archetype)) {
      problems.push(`entity form ${form.localName} has unknown archetype ${form.archetype}`);
    }
    checkSources(`entity form ${form.localName}`, form.sourceIds);
  }

  for (const tax of sheet.consumptionTaxes ?? []) {
    if (!(CONSUMPTION_TAX_ARCHETYPES as readonly string[]).includes(tax.archetype)) {
      problems.push(`consumption tax ${tax.localName} has unknown archetype ${tax.archetype}`);
    }
    checkSources(`consumption tax ${tax.localName}`, tax.sourceIds);
  }

  const ruleIds = new Set<string>();
  for (const rule of sheet.rules ?? []) {
    if (ruleIds.has(rule.id)) problems.push(`duplicate rule id ${rule.id}`);
    ruleIds.add(rule.id);
    if (!rule.statement?.trim()) problems.push(`rule ${rule.id} has no statement`);
    if (!rule.topics?.length) problems.push(`rule ${rule.id} has no topics`);
    for (const topic of rule.topics ?? []) {
      if (!isJurisdictionTopic(topic)) problems.push(`rule ${rule.id} has unknown topic ${topic}`);
    }
    if (!rule.effectiveFrom || !ISO_DATE.test(rule.effectiveFrom)) {
      problems.push(`rule ${rule.id} needs an ISO effectiveFrom date`);
    }
    checkSources(`rule ${rule.id}`, rule.sourceIds);
  }

  return problems;
}
