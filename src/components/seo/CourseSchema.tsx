export default function CourseSchema(){

const schema={

"@context":"https://schema.org",

"@type":"Course",

"name":"Financial Literacy",

"provider":{

"@type":"EducationalOrganization",

"name":"Edunancial"

}

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
