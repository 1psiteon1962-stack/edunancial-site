import { serializeJsonForHtml } from "@/lib/security/json";

export default function BreadcrumbSchema(){

const schema={

"@context":"https://schema.org",

"@type":"BreadcrumbList",

"itemListElement":[]

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
