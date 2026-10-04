import { Buffer } from "node:buffer";
import { getAdminContentStorage } from "@/lib/admin-content/storage";

export async function updateJsonCas<T>(path:string,mutate:(current:T|null)=>T|null,message?:string):Promise<T|null>{
 const storage=getAdminContentStorage();
 if(!storage.updateBinary)throw new Error("Storage does not support compare-and-swap updates.");
 let result:T|null=null;
 const ok=await storage.updateBinary(path,(raw)=>{
  let current:T|null=null;
  if(raw){try{current=JSON.parse(raw.toString("utf8")) as T;}catch{current=null;}}
  result=mutate(current);
  return result===null?null:Buffer.from(`${JSON.stringify(result,null,2)}\n`,"utf8");
 },message);
 if(!ok)return null;
 return result;
}
