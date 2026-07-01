import { Metadata } from "next";

export function createSEO(

title:string,

description:string,

path:string

):Metadata{

return{

title,

description,

alternates:{

canonical:`https://www.edunancial.com${path}`

},

openGraph:{

title,

description,

url:`https://www.edunancial.com${path}`,

siteName:"Edunancial",

type:"website"

},

twitter:{

card:"summary_large_image",

title,

description

}

};

}
