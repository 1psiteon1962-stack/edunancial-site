export interface DownloadRequest{
subscriberId:string;
leadMagnetId:string;
email:string;
sent:boolean;
sentAt?:string;
}

export function sendDownload(r:DownloadRequest){
r.sent=true;
r.sentAt=new Date().toISOString();
return r;
}
