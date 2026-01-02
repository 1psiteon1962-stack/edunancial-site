import { Language } from './language';

export interface Pricing {
  currency: string;
  monthly: number;
  annual: number;
  quarterly: number;
  lifetime: number;
}

export interface RegionCurriculumContent {
  title: string;
  description: string;
  curriculum: string[];
  pricing: Pricing;
}

export type RegionKey =
  | 'us'
  | 'africa'
  | 'europe'
  | 'asia'
  | 'asia-emerging'
  | 'asia-pacific'
  | 'mena';

export type RegionContentMap = Record<
  RegionKey,
  Record<Language, RegionCurriculumContent>
>;
