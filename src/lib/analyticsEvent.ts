export interface AnalyticsEvent {

  id:string;

  timestamp:string;

  region:string;

  country:string;

  language:string;

  eventType:string;

  page:string;

  productId?:string;

  customerId?:string;

  revenue?:number;

  metadata?:Record<string,unknown>;

}

export function createAnalyticsEvent(
event:AnalyticsEvent
){

return event;

}
