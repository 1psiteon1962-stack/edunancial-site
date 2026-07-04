export interface CourseRecommendation {

  title: string;

  category: string;

  priority:
    | "low"
    | "medium"
    | "high";

}

export function getCourseRecommendations(): CourseRecommendation[] {

  return [

    {

      title: "Financial Competency Fundamentals",

      category: "Core",

      priority: "high",

    },

    {

      title: "Starting a Business",

      category: "Business",

      priority: "high",

    },

    {

      title: "Understanding Credit",

      category: "Personal Finance",

      priority: "medium",

    },

  ];

}
