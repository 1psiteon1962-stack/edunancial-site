export interface Backup{

id:string;

type:
"full"|
"incremental";

status:
"running"|
"completed"|
"failed";

size:number;

startedAt:string;

completedAt?:string;

}
