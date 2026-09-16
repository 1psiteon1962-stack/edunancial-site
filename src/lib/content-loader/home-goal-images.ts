export const HOME_GOALS=["business","realEstate","retirement","finances","career","family"] as const;

export type HomeGoal=(typeof HOME_GOALS)[number];

const APPROVED_PHOTO_VERSION="approved-20260915";

export const HOME_GOAL_IMAGE_PATHS:Record<HomeGoal,string>={
 business:`/images/home/goals/business-start.jpg?v=${APPROVED_PHOTO_VERSION}`,
 realEstate:`/images/home/goals/real-estate-investing.jpg?v=${APPROVED_PHOTO_VERSION}`,
 retirement:`/images/home/goals/retirement-family.jpg?v=${APPROVED_PHOTO_VERSION}`,
 finances:`/images/home/goals/financial-control.jpg?v=${APPROVED_PHOTO_VERSION}`,
 career:`/images/home/goals/career-growth.jpg?v=${APPROVED_PHOTO_VERSION}`,
 family:`/images/home/goals/family-finances.jpg?v=${APPROVED_PHOTO_VERSION}`
};
