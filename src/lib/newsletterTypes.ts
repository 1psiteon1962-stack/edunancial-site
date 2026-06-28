export interface Newsletter{

id:string;

title:string;

subject:string;

html:string;

created:string;

scheduled:string;

status:

"draft"|

"scheduled"|

"sent";

recipients:number;

}
