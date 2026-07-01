export default function OrganizationSchema(){

const schema={

"@context":"https://schema.org",

"@type":"EducationalOrganization",

"name":"Edunancial",

"url":"https://www.edunancial.com",

"description":"Global financial literacy and business education platform.",

"sameAs":[]

};

return(

<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html:JSON.stringify(schema)
}}
/>

);

}
