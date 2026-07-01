import OrganizationSchema from "./OrganizationSchema";
import WebsiteSchema from "./WebsiteSchema";
import BreadcrumbSchema from "./BreadcrumbSchema";
import FAQSchema from "./FAQSchema";
import GoogleVerification from "./GoogleVerification";

export default function SeoDefaults(){

return(

<>

<GoogleVerification/>

<OrganizationSchema/>

<WebsiteSchema/>

<BreadcrumbSchema/>

<FAQSchema/>

</>

);

}
