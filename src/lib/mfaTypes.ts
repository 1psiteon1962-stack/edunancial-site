export interface MFAConfiguration{

userId:string;

enabled:boolean;

method:

"totp"|

"email"|

"sms"|

"passkey";

verified:boolean;

}
