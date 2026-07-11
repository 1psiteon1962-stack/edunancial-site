import { Metadata } from "next";
import { getApacCountry } from "@/lib/regionalization/apacFoundation";

interface SEOOptions {
  locale?: string;
  alternateLocales?: string[];
  index?: boolean;
}

export function createSEO(

title:string,

description:string,

path:string,

options:SEOOptions={}

):Metadata{

const canonical=`https://www.edunancial.com${path}`;

const languageAlternates=options.alternateLocales?.length
?Object.fromEntries(
options.alternateLocales.map((locale)=>[
locale,
`https://www.edunancial.com/${locale.toLowerCase().replace("_","-")}${path}`
])
)
:undefined;

return{

title,

description,

alternates:{

canonical,

languages:languageAlternates

},

openGraph:{

title,

description,

url:canonical,

siteName:"Edunancial",

locale:options.locale,

alternateLocale:options.alternateLocales,

type:"website"

},

twitter:{

card:"summary_large_image",

title,

description

},

robots:options.index===false?{
index:false,
follow:false
}:undefined

};

}

export function createRegionalSEO(
countryId:string,
title:string,
description:string,
path:string
):Metadata{

const country=getApacCountry(countryId);

if(!country){
return createSEO(title,description,path);
}

return createSEO(
title,
description,
`${country.seo.pathPrefix}${path}`,
{
locale:country.seo.locale,
alternateLocales:country.seo.alternateLocales,
index:country.seo.indexable
}
);

}
