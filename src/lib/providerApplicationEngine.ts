import {ProviderApplication} from "./providerApplicationTypes";

export function approveApplication(app:ProviderApplication){
return{...app,status:"approved" as const};
}

export function rejectApplication(app:ProviderApplication){
return{...app,status:"rejected" as const};
}

export function requestMoreInfo(app:ProviderApplication){
return{...app,status:"more_info" as const};
}
