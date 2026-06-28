import { GlobalPermission } from "./globalPermissions";

export interface GlobalRole {

  name:string;

  permissions:GlobalPermission[];

}

export const GLOBAL_ROLES:GlobalRole[]=[

{

name:"CEO",

permissions:Object.values(GlobalPermission)

},

{

name:"Regional Director",

permissions:[

GlobalPermission.VIEW_REGION_DASHBOARD,

GlobalPermission.VIEW_COUNTRY_DASHBOARD,

GlobalPermission.MANAGE_BOOKS,

GlobalPermission.MANAGE_COURSES,

GlobalPermission.MANAGE_KPIS

]

},

{

name:"Country Director",

permissions:[

GlobalPermission.VIEW_COUNTRY_DASHBOARD,

GlobalPermission.MANAGE_BOOKS,

GlobalPermission.MANAGE_COURSES

]

}

];
