export const ArchitectureStatus = {

globalArchitecture:true,

regionalArchitecture:true,

countryArchitecture:true,

languageArchitecture:true,

currencyArchitecture:true,

analyticsArchitecture:true,

kpiArchitecture:true,

dashboardArchitecture:true,

permissionsArchitecture:true,

forecastArchitecture:true,

executiveArchitecture:true,

adminArchitectureReady:true

};

export function architectureReady(){

return Object.values(
ArchitectureStatus
).every(Boolean);

}
