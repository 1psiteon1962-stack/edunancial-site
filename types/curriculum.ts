export interface RegionCurriculumContent {
  title: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    monthly: number;
    quarterly: number;
    annual: number;
    lifetime: number;
    enterprise: string;
  };
  callToAction: string;
}
