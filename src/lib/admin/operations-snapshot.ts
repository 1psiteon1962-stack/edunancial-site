import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

export type LiveValue = { value: number | null; status: "LIVE" | "UNAVAILABLE"; source: string };
export interface ExecutiveOperationsSnapshot {
  asOf: string; grossRevenue: LiveValue; netRevenue: LiveValue; activeMembers: LiveValue; newMembers30d: LiveValue; failedPayments: LiveValue; refunds: LiveValue; salesTaxCollected: LiveValue; salesTaxRemitted: LiveValue; salesTaxDue: LiveValue; totalBusinessTaxDue: LiveValue; taxJurisdictionsDue: LiveValue;
  upload: { status: "READY" | "DEGRADED" | "BLOCKED"; signedUploadConfigured: boolean; fallbackAvailable: boolean; githubPublishingConfigured: boolean; failures24h: number | null; fallbacks24h: number | null; lastFailure: string | null; problems: string[] };
}
type PaymentRow = { amount: number | string | null; status: string | null; currency: string | null };
type TaxRow = { country_code: string; jurisdiction_code: string | null; tax_type: string; tax_collected: number | string | null; tax_remitted: number | string | null; amount_due: number | string | null };
type UploadOp = { status: string; error_message: string | null; created_at: string };
const live=(value:number|null,source:string):LiveValue=>({value,status:value===null?"UNAVAILABLE":"LIVE",source});
const num=(v:unknown)=>{const p=Number(v??0);return Number.isFinite(p)?p:0};
export async function getExecutiveOperationsSnapshot():Promise<ExecutiveOperationsSnapshot>{
 const asOf=new Date().toISOString(), unavailable=(s:string)=>live(null,s), since30=new Date(Date.now()-30*86400000).toISOString(), since24=new Date(Date.now()-86400000).toISOString();
 const signedUploadConfigured=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()&&process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()&&(process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET?.trim()||process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY?.trim()));
 const githubPublishingConfigured=Boolean(process.env.EDUNANCIAL_GITHUB_TOKEN?.trim()&&process.env.EDUNANCIAL_GITHUB_OWNER?.trim()&&process.env.EDUNANCIAL_GITHUB_REPO?.trim());
 const fallbackAvailable=process.env.NODE_ENV!=="production"||Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()); const problems:string[]=[];
 if(!signedUploadConfigured)problems.push("Signed upload configuration incomplete."); if(!githubPublishingConfigured)problems.push("GitHub publishing configuration incomplete.");
 try{
  const db=getKpiSupabaseAdmin();
  const [pr,mr,nr,tr,ur]=await Promise.all([
   db.from("payment_transactions").select("amount,status,currency"), db.from("members").select("id",{count:"exact",head:true}).eq("active",true), db.from("members").select("id",{count:"exact",head:true}).gte("created_at",since30), db.from("business_tax_ledger").select("country_code,jurisdiction_code,tax_type,tax_collected,tax_remitted,amount_due"), db.from("admin_upload_operations").select("status,error_message,created_at").gte("created_at",since24).order("created_at",{ascending:false}).limit(500)
  ]);
  const payments=pr.error?null:(pr.data??[]) as unknown as PaymentRow[], taxes=tr.error?null:(tr.data??[]) as unknown as TaxRow[], ops=ur.error?null:(ur.data??[]) as unknown as UploadOp[];
  const completed=payments?.filter(r=>r.status==="completed")??null, refunded=payments?.filter(r=>r.status==="refunded")??null, failed=payments?.filter(r=>r.status==="failed")??null;
  const gross=completed?completed.reduce((s,r)=>s+num(r.amount),0):null, refundTotal=refunded?refunded.reduce((s,r)=>s+num(r.amount),0):null, net=gross===null||refundTotal===null?null:gross-refundTotal;
  const sales=taxes?.filter(r=>r.tax_type==="SALES_CONSUMPTION")??null, collected=sales?sales.reduce((s,r)=>s+num(r.tax_collected),0):null, remitted=sales?sales.reduce((s,r)=>s+num(r.tax_remitted),0):null, salesDue=sales?sales.reduce((s,r)=>s+num(r.amount_due),0):null, totalDue=taxes?taxes.reduce((s,r)=>s+num(r.amount_due),0):null;
  const jurisdictions=taxes?new Set(taxes.filter(r=>num(r.amount_due)>0).map(r=>`${r.country_code}:${r.jurisdiction_code??""}`)).size:null;
  const failures=ops?.filter(r=>r.status==="FAILED")??null, fallbacks=ops?.filter(r=>r.status==="FALLBACK")??null, lastFailure=failures?.[0]?.error_message??null; if(failures?.length)problems.push(`${failures.length} upload pipeline failure(s) recorded in the last 24 hours.`);
  const baseReady=signedUploadConfigured&&githubPublishingConfigured; const uploadStatus=!baseReady?"BLOCKED":failures?.length?"DEGRADED":"READY";
  return {asOf,grossRevenue:payments?live(gross,"payment_transactions"):unavailable("payment_transactions"),netRevenue:payments?live(net,"payment_transactions"):unavailable("payment_transactions"),activeMembers:mr.error?unavailable("members"):live(mr.count??0,"members"),newMembers30d:nr.error?unavailable("members"):live(nr.count??0,"members"),failedPayments:failed?live(failed.length,"payment_transactions"):unavailable("payment_transactions"),refunds:refunded?live(refundTotal,"payment_transactions"):unavailable("payment_transactions"),salesTaxCollected:sales?live(collected,"business_tax_ledger"):unavailable("business_tax_ledger"),salesTaxRemitted:sales?live(remitted,"business_tax_ledger"):unavailable("business_tax_ledger"),salesTaxDue:sales?live(salesDue,"business_tax_ledger"):unavailable("business_tax_ledger"),totalBusinessTaxDue:taxes?live(totalDue,"business_tax_ledger"):unavailable("business_tax_ledger"),taxJurisdictionsDue:taxes?live(jurisdictions,"business_tax_ledger"):unavailable("business_tax_ledger"),upload:{status:uploadStatus,signedUploadConfigured,fallbackAvailable,githubPublishingConfigured,failures24h:failures?.length??null,fallbacks24h:fallbacks?.length??null,lastFailure,problems}};
 }catch{return {asOf,grossRevenue:unavailable("payment_transactions"),netRevenue:unavailable("payment_transactions"),activeMembers:unavailable("members"),newMembers30d:unavailable("members"),failedPayments:unavailable("payment_transactions"),refunds:unavailable("payment_transactions"),salesTaxCollected:unavailable("business_tax_ledger"),salesTaxRemitted:unavailable("business_tax_ledger"),salesTaxDue:unavailable("business_tax_ledger"),totalBusinessTaxDue:unavailable("business_tax_ledger"),taxJurisdictionsDue:unavailable("business_tax_ledger"),upload:{status:"BLOCKED",signedUploadConfigured,fallbackAvailable,githubPublishingConfigured,failures24h:null,fallbacks24h:null,lastFailure:null,problems:[...problems,"Executive data source unavailable."]}}}
}
