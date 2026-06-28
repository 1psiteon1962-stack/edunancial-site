export interface Secret{

id:string;

name:string;

environment:
"development"|
"staging"|
"production";

rotatedAt:string;

expiresAt:string;

active:boolean;

}
