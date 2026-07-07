// ======================================================
// MEMBERSHIP CONFIGURATION
// FILE 1036
// PART 1
// ======================================================

export const Memberships = {

visitor:{

name:"Visitor",

priceMonthly:0,

priceAnnual:0,

previewAllowed:true,

},

preview:{

name:"Preview",

priceMonthly:0,

priceAnnual:0,

previewAllowed:false,

},

learn:{

name:"Learn",

priceMonthly:9.99,

priceAnnual:99,

previewAllowed:false,

},

build:{

name:"Build",

priceMonthly:39.99,

priceAnnual:399,

previewAllowed:false,

},

lead:{

name:"Lead",

priceMonthly:99.99,

priceAnnual:999,

previewAllowed:false,

},

enterprise:{

name:"Enterprise",

priceMonthly:null,

priceAnnual:null,

previewAllowed:false,

},

};

// ======================================================
// MEMBERSHIP FEATURES
// FILE 1036
// PART 2
// ======================================================

export const MembershipFeatures = {

learn: [

"Dashboard",

"Learning Paths",

"Financial Literacy",

"Assessment",

"Progress Tracking",

"Basic AI",

],

build: [

"Everything in Learn",

"Business Courses",

"Investing",

"Real Estate",

"Decision Labs",

"Case Studies",

"Business AI",

"KPI Dashboard",

],

lead: [

"Everything in Build",

"Executive Dashboard",

"Executive AI",

"International Expansion",

"Pricing Intelligence",

"Market Intelligence",

"Founder Reports",

],

enterprise: [

"Organization Dashboard",

"Student Management",

"Organization Analytics",

"Enterprise Reporting",

"Dedicated AI",

"API Access",

"Administrative Controls",

],

};

// ======================================================
// MEMBERSHIP FEATURE MATRIX
// FILE 1036
// PART 2 OF 2
// ======================================================

export const MembershipFeatures = {

  visitor: [
    "Homepage",
    "Public Pages",
    "Sample Lesson"
  ],

  preview: [
    "One Sample Lesson",
    "One Sample Assessment",
    "Limited Dashboard Preview"
  ],

  learn: [
    "Full Foundations Curriculum",
    "Basic Financial Literacy",
    "Basic Financial Competency",
    "Course Certificates",
    "Progress Dashboard",
    "Basic AI Coach"
  ],

  build: [
    "Everything in Learn",
    "Business Courses",
    "Investment Courses",
    "Real Estate Courses",
    "Business KPI Dashboard",
    "Business AI",
    "Decision Labs",
    "Case Studies"
  ],

  lead: [
    "Everything in Build",
    "Executive Dashboard",
    "International Expansion",
    "Market Intelligence",
    "Advanced Analytics",
    "Leadership AI",
    "Hiring AI",
    "Legal AI",
    "Tax AI"
  ],

  enterprise: [
    "Everything in Lead",
    "Organization Dashboard",
    "Multiple User Accounts",
    "Instructor Portal",
    "Enterprise Reporting",
    "Dedicated AI",
    "Organization Analytics",
    "Priority Support",
    "API Access"
  ]

};

// ======================================================
// SAMPLE CONTENT RULES
// ======================================================

export const SampleRules = {

  maximumSampleCourses: 1,

  maximumSampleAssessments: 1,

  allowRepeatSamples: false,

  requireAccountCreation: true,

  requireEmailVerification: true

};

// ======================================================
// END OF FILE
// ======================================================
