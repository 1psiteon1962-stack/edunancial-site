"use client";

import { useState } from "react";
import { PAID_PURCHASER_ATTESTATION } from "@/lib/age-consent";
import { startSquareCheckout } from "@/lib/squareCheckout";

interface SquareCheckoutProps { planId:string; amount:number; currency:string; planName?:string; memberEmail?:string; }
export default function SquareCheckout({planId,amount,currency,planName,memberEmail}:SquareCheckoutProps){
 const [loading,setLoading]=useState(false);const [error,setError]=useState<string|null>(null);const [authorized,setAuthorized]=useState(false);
 async function handleCheckout(){if(!authorized){setError("Adult purchaser authorization is required before payment.");return;}try{setLoading(true);setError(null);await startSquareCheckout({id:planId,name:planName??`Plan ${planId}`,price:amount,currency,memberEmail});}catch(err){setError(err instanceof Error?err.message:"Checkout failed. Please try again.");}finally{setLoading(false);}}
 return <div className="space-y-3"><label className="flex items-start gap-3 rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700"><input type="checkbox" checked={authorized} onChange={e=>setAuthorized(e.target.checked)} className="mt-1 shrink-0"/><span>{PAID_PURCHASER_ATTESTATION}</span></label><button onClick={handleCheckout} disabled={loading||!authorized} className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50">{loading?"Connecting…":`Pay ${currency} ${amount}`}</button>{error&&<p className="text-center text-sm text-red-500">{error}</p>}<p className="text-xs text-slate-500">This authorization applies to all paid Edunancial programs. Free access does not create a payment obligation.</p></div>;
}
