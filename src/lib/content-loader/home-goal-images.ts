export const HOME_GOALS=["business","realEstate","retirement","finances","career","family"] as const;

export type HomeGoal=(typeof HOME_GOALS)[number];

export const HOME_GOAL_IMAGE_PATHS:Record<HomeGoal,string>={
 business:"/images/home/goals/business-start.jpg",
 realEstate:"/images/home/goals/real-estate-investing.jpg",
 retirement:"/images/home/goals/retirement-family.jpg",
 finances:"/images/home/goals/financial-control.jpg",
 career:"/images/home/goals/career-growth.jpg",
 family:"/images/home/goals/family-finances.jpg"
};
