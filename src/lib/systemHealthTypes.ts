export interface SystemHealth{

timestamp:string;

status:"healthy"|"warning"|"critical";

uptime:number;

cpu:number;

memory:number;

database:boolean;

storage:boolean;

payments:boolean;

email:boolean;

api:boolean;

}
