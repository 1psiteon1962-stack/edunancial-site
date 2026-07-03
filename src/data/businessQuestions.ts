export interface BusinessQuestion {
  id: string;
  category: string;
  question: string;
  answers: string[];
}

export const businessQuestions: BusinessQuestion[] = [

{
id: "years",
category: "Business Stage",
question: "How long have you been in business?",
answers: [
"Not in business yet",
"Less than 1 year",
"1-3 years",
"4-7 years",
"8-15 years",
"15+ years"
]
},

{
id: "employees",
category: "Operations",
question: "How many employees do you currently have?",
answers: [
"Just me",
"2-5",
"6-10",
"11-25",
"26-100",
"100+"
]
},

{
id: "revenue",
category: "Revenue",
question: "Annual gross revenue?",
answers: [
"Pre-Revenue",
"Under $100,000",
"$100k-$500k",
"$500k-$1M",
"$1M-$10M",
"Over $10M"
]
},

{
id: "profitability",
category: "Profit",
question: "Is your business consistently profitable?",
answers: [
"No",
"Occasionally",
"Break-even",
"Usually",
"Yes"
]
},

{
id: "cashflow",
category: "Cash Flow",
question: "How would you rate your cash flow?",
answers: [
"Critical",
"Weak",
"Average",
"Good",
"Excellent"
]
},

{
id: "marketing",
category: "Marketing",
question: "Where do most of your customers come from?",
answers: [
"Referrals",
"Social Media",
"Advertising",
"Repeat Customers",
"Cold Outreach",
"Multiple Sources"
]
},

{
id: "pricing",
category: "Pricing",
question: "How confident are you in your pricing?",
answers: [
"Very Low",
"Low",
"Average",
"High",
"Very High"
]
},

{
id: "numbers",
category: "KPIs",
question: "How often do you review your business numbers?",
answers: [
"Never",
"Monthly",
"Weekly",
"Several times per week",
"Daily"
]
},

{
id: "growth",
category: "Growth",
question: "What is your biggest obstacle today?",
answers: [
"Cash Flow",
"Finding Customers",
"Hiring",
"Leadership",
"Profit",
"Marketing",
"Systems",
"Scaling",
"Financing",
"Taxes"
]
}

];
