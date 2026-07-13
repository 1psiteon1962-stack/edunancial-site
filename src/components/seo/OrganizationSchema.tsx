import { EDUNANCIAL_LONG_DESCRIPTION } from "@/lib/positioning";

export default function OrganizationSchema(){

const schema={

"@context":"https://schema.org",

"@type":"Organization",

"name":"Edunancial",

"url":"https://www.edunancial.com",

"description":EDUNANCIAL_LONG_DESCRIPTION,

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
