export type WealthLadderStage = {
  stage: number;
  title: string;
  description: string;
};

export const EDUNANCIAL_WEALTH_LADDER: WealthLadderStage[] = [
  {
    stage: 1,
    title: "Discipline",
    description:
      "Establish financial discipline, income stability, and expense control."
  },
  {
    stage: 2,
    title: "Capital Preservation",
    description:
      "Protect accumulated capital through risk control, diversification, and savings structures."
  },
  {
    stage: 3,
    title: "Strategic Investment",
    description:
      "Deploy capital into opportunities that produce long-term growth."
  },
  {
    stage: 4,
    title: "Asset Scaling",
    description:
      "Scale productive assets and systems that generate increasing returns."
  },
  {
    stage: 5,
    title: "Financial Independence",
    description:
      "Achieve sustainable financial freedom through diversified income streams."
  }
];
