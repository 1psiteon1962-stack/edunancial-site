export interface BusinessCourse {

  id: string;

  title: string;

  category: string;

  difficulty: "Beginner" | "Intermediate" | "Advanced";

  estimatedHours: number;

  prerequisite: string | null;

  description: string;

}

export const businessCourses: BusinessCourse[] = [

{
id: "know-your-numbers",
title: "Know Your Numbers",
category: "Financial",
difficulty: "Beginner",
estimatedHours: 4,
prerequisite: null,
description: "The foundation of every profitable business."
},

{
id: "cash-flow",
title: "Cash Flow Management",
category: "Financial",
difficulty: "Beginner",
estimatedHours: 5,
prerequisite: "know-your-numbers",
description: "Understand and manage cash movement."
},

{
id: "profit-first",
title: "Profit Before Growth",
category: "Financial",
difficulty: "Intermediate",
estimatedHours: 6,
prerequisite: "cash-flow",
description: "Why profit—not revenue—is the objective."
},

{
id: "pricing",
title: "Pricing Strategy",
category: "Sales",
difficulty: "Intermediate",
estimatedHours: 4,
prerequisite: "know-your-numbers",
description: "Build profitable pricing models."
},

{
id: "sales",
title: "Sales Systems",
category: "Sales",
difficulty: "Intermediate",
estimatedHours: 8,
prerequisite: "pricing",
description: "Create predictable revenue."
},

{
id: "marketing",
title: "Marketing ROI",
category: "Marketing",
difficulty: "Intermediate",
estimatedHours: 6,
prerequisite: "sales",
description: "Measure marketing by profitability."
},

{
id: "leadership",
title: "Leadership",
category: "Management",
difficulty: "Advanced",
estimatedHours: 8,
prerequisite: "profit-first",
description: "Lead people instead of managing tasks."
},

{
id: "hiring",
title: "Hiring Great Employees",
category: "Management",
difficulty: "Advanced",
estimatedHours: 6,
prerequisite: "leadership",
description: "Recruit and retain top performers."
},

{
id: "systems",
title: "Business Systems",
category: "Operations",
difficulty: "Advanced",
estimatedHours: 10,
prerequisite: "leadership",
description: "Build systems that scale."
},

{
id: "scale",
title: "Scaling A Business",
category: "Growth",
difficulty: "Advanced",
estimatedHours: 12,
prerequisite: "
