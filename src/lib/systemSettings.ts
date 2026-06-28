export interface SystemSettings{

maintenanceMode:boolean;

allowRegistrations:boolean;

allowDownloads:boolean;

allowPurchases:boolean;

allowCourseEnrollment:boolean;

defaultLanguage:string;

defaultCurrency:string;

defaultRegion:string;

}

export const DEFAULT_SYSTEM_SETTINGS:SystemSettings={

maintenanceMode:false,

allowRegistrations:true,

allowDownloads:true,

allowPurchases:true,

allowCourseEnrollment:true,

defaultLanguage:"en",

defaultCurrency:"USD",

defaultRegion:"north-america"

};
