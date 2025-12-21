// lib/levels.ts

export type LevelKey = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface LevelMeta {
  key: LevelKey;
  title: string;
  summary: string;
  focus: string[];
  nextStep: string;
}

/**
 * Canonical level definitions used across:
 * - Edunancial core
 * - EduMath
 * - EduVesting
 * - LevelGate
 */
export const LEVEL_META: Record<LevelKey, LevelMeta> = {
  L1: {
    key: 'L1',
    title: 'Foundational Awareness',
    summary: 'Understanding money, income, and basic financial behavior.',
    focus: [
      'Income vs expenses',
      'Banking basics',
      'Budget awareness',
      'Financial habits'
    ],
    nextStep: 'Learn structured saving and simple investing concepts.'
  },

  L2: {
    key: 'L2',
    title: 'Structured Control',
    summary: 'Applying structure to cash flow and financial decisions.',
    focus: [
      'Budget systems',
      'Emergency funds',
      'Credit fundamentals',
      'Risk awareness'
    ],
    nextStep: 'Begin asset-focused thinking and compounding.'
  },

  L3: {
    key: 'L3',
    title: 'Asset Orientation',
    summary: 'Transitioning from earning income to acquiring assets.',
    focus: [
      'Stocks and ETFs',
      'Basic real estate concepts',
      'Time value of money',
      'Long-term planning'
    ],
    nextStep: 'Learn leverage, tax efficiency, and capital strategy.'
  },

  L4: {
    key: 'L4',
    title: 'Strategic Capital Use',
    summary: 'Using capital intentionally to scale wealth.',
    focus: [
      'Advanced investing',
      'Tax strategy',
      'Entity structuring',
      'Risk layering'
    ],
    nextStep: 'Shift from personal wealth to systems and scale.'
  },

  L5: {
    key: 'L5',
    title: 'Capital Architecture',
    summary: 'Designing systems that deploy capital at scale.',
    focus: [
      'Private equity logic',
      'Fund structures',
      'Cross-border strategy',
      'Governance and control'
    ],
    nextStep: 'Operate at the institutional and global level.'
  }
};

/**
 * Convenience export if needed elsewhere
 */
export const LEVEL_KEYS = Object.keys(LEVEL_META) as LevelKey[];
