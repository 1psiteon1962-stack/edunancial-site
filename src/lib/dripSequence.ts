export interface DripEmail{
id:string;
templateId:string;
delayDays:number;
order:number;
}

export interface DripSequence{
id:string;
name:string;
emails:DripEmail[];
active:boolean;
}
