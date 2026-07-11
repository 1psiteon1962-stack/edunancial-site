import { Metadata } from "next";

export function createSEO(

title:string,

description:string,

path:string,

localizedPaths?:Record<string,string>

):Metadata{

return{

title,

description,

alternates:{

canonical:`https://www.edunancial.com${path}`,

languages: localizedPaths
  ? Object.fromEntries(
      Object.entries(localizedPaths).map(([locale, localizedPath]) => [
        locale,
        `https://www.edunancial.com${localizedPath}`
      ])
    )
  : undefined

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
