import { serializeJsonForHtml } from "@/lib/security/json";

export default function OrganizationSchema(){

const schema={

"@context":"https://schema.org",

"@type":"EducationalOrganization",

"name":"Edunancial",

"url":"https://www.edunancial.com",

"logo":"https://www.edunancial.com/logo.png",

"description":"Edunancial is a financial education platform that builds understanding, confidence, decision-making ability, and real-world financial competence. We help people make better financial decisions for life.",

"knowsAbout":[
  "Personal Finance",
  "Financial Literacy",
  "Wealth Building",
  "Real Estate Investing",
  "Stock Market",
  "Business Finance",
  "Retirement Planning",
  "Credit Management",
  "Tax Education",
  "Insurance"
],

"hasOfferCatalog":{
  "@type":"OfferCatalog",
  "name":"Edunancial Courses and Resources",
  "numberOfItems":500
},

"sameAs":[]

};

return(

<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html:serializeJsonForHtml(schema)
}}
/>

);

}
