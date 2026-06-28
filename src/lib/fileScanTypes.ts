export interface FileScan{

id:string;

filename:string;

size:number;

virusDetected:boolean;

status:
"queued"|
"scanning"|
"clean"|
"infected";

uploadedAt:string;

}
