export interface FunnelEvent{
subscriberId:string;
step:
"visitor"|
"lead"|
"email_open"|
"email_click"|
"purchase"|
"member";
date:string;
}

export function nextStep(
events:FunnelEvent[],
event:FunnelEvent
){
return [...events,event];
}
