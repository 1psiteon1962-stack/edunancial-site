export enum DashboardRole{

GLOBAL_ADMIN="GLOBAL_ADMIN",

CONTINENT_ADMIN="CONTINENT_ADMIN",

REGIONAL_ADMIN="REGIONAL_ADMIN",

COUNTRY_ADMIN="COUNTRY_ADMIN",

CITY_ADMIN="CITY_ADMIN",

INSTRUCTOR="INSTRUCTOR",

ACCOUNTING="ACCOUNTING",

MARKETING="MARKETING"

}

export function canViewGlobalDashboard(
role:DashboardRole
){

return role===DashboardRole.GLOBAL_ADMIN;

}

export function canViewContinentDashboard(
role:DashboardRole
){

return[
DashboardRole.GLOBAL_ADMIN,
DashboardRole.CONTINENT_ADMIN
].includes(role);

}

export function canViewCountryDashboard(
role:DashboardRole
){

return[
DashboardRole.GLOBAL_ADMIN,
DashboardRole.CONTINENT_ADMIN,
DashboardRole.REGIONAL_ADMIN,
DashboardRole.COUNTRY_ADMIN
].includes(role);

}
