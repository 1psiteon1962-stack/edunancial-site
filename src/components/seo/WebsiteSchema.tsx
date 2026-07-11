import { serializeJsonForHtml } from "@/lib/security/json";

export default function WebsiteSchema(){

const schema={

"@context":"https://schema.org",

"@type":"WebSite",

"name":"Edunancial",

"url":"https://www.edunancial.com"

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
