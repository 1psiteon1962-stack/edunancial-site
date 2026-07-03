export interface LearningPath {

  id: string;

  title: string;

  description: string;

  color: string;

  icon: string;

  courses: string[];

}

export const learningPaths: LearningPath[] = [

{
id: "red",

title: "Real Estate",

description:
"Acquire, manage and grow wealth through real estate investing.",

color: "#dc2626",

icon: "🏘️",

courses: [

"Real Estate Fundamentals",

"Creative Financing",

"Land Trusts",

"Tax Liens",

"Tax Deeds",

"Commercial Real Estate",

"1031 Exchanges",

"Property Management",

"Multifamily Investing",

"International Real Estate"

]

},

{
id: "white",

title: "Paper Assets",

description:
"Build wealth through stocks, bonds, ETFs and options.",

color: "#e5e7eb",

icon: "📈",

courses: [

"Financial Markets",

"Stock Investing",

"Dividend Investing",

"ETF Investing",

"Mutual Funds",

"Options",

"Risk Management",

"Portfolio Allocation",

"Retirement Planning",

"Advanced Investing"

]

},

{
id: "blue",

title: "Business",

description:
"Create profitable businesses capable of long-term growth.",

color: "#2563eb",

icon: "🏢",

courses: [

"Know Your Numbers",

"Cash Flow",

"Profit First",

"Pricing",

"Sales",

"Marketing",

"Hiring",

"Leadership",

"Systems",

"Scaling"

]

}

];
