export default function FAQSchema(){

const schema={

"@context":"https://schema.org",

"@type":"FAQPage",

"mainEntity":[]

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
