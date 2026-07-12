import { APAC_LOCALES } from "@/config/asia-pacific/index";

const BASE_URL = "https://www.edunancial.com";

export default function sitemap(){

const coreRoutes=[

{url:`${BASE_URL}`,lastModified:new Date()},

{url:`${BASE_URL}/about`,lastModified:new Date()},

{url:`${BASE_URL}/courses`,lastModified:new Date()},

{url:`${BASE_URL}/membership`,lastModified:new Date()},

{url:`${BASE_URL}/levels`,lastModified:new Date()},

{url:`${BASE_URL}/sponsor`,lastModified:new Date()},

{url:`${BASE_URL}/contact`,lastModified:new Date()},

{url:`${BASE_URL}/privacy`,lastModified:new Date()},

{url:`${BASE_URL}/trust-center`,lastModified:new Date()},

{url:`${BASE_URL}/security`,lastModified:new Date()},

{url:`${BASE_URL}/disclaimer`,lastModified:new Date()},

{url:`${BASE_URL}/terms`,lastModified:new Date()},

{url:`${BASE_URL}/refund-policy`,lastModified:new Date()},

{url:`${BASE_URL}/faq`,lastModified:new Date()},

{url:`${BASE_URL}/assessment`,lastModified:new Date()},

{url:`${BASE_URL}/why-edunancial`,lastModified:new Date()},

{url:`${BASE_URL}/asia-pacific`,lastModified:new Date()},

];

const apacLocaleRoutes=APAC_LOCALES.map((locale)=>({

url:`${BASE_URL}/asia-pacific/${locale}`,

lastModified:new Date(),

}));

return[...coreRoutes,...apacLocaleRoutes];

}
