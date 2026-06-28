export interface IntrusionDetection{

id:string;

sourceIp:string;

country:string;

attackType:
"bruteforce"|
"sql_injection"|
"xss"|
"ddos"|
"unknown";

severity:
"low"|
"medium"|
"high"|
"critical";

blocked:boolean;

detectedAt:string;

}
