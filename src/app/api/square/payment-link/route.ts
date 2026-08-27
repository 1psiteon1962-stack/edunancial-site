/** Unified Square Payment Link API */
import { NextResponse } from "next/server";
import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { ensureSquareWebhookSubscription, isSquareVerifiedCheckoutEnabled, squareConfig } from "@/lib/square";
import { enforcePaymentRateLimit } from "@/lib/payments/rateLimiter";
import { resolveCatalogItem } from "@/lib/payments/catalog";
import { resolveMarketplaceCatalogItem } from "@/lib/payments/marketplaceCatalog";
import { applyDiscountCode, recordDiscountRedemption } from "@/lib/payments/discounts";
import { hasPaymentPersistenceConfig, persistCheckoutInitiation } from "@/lib/payments/persistence";
import { getCountryByISO, isCountryFeatureEnabled } from "@/lib/countries/country-service";
import { assertCountryOperationAllowed } from "@/lib/regions/runtime-controls";
import { resolveCheckoutTax } from "@/lib/tax/checkout-tax";

interface PaymentLinkRequestBody { itemId?: string; discountCode?: string; customerEmail?: string; countryCode?: string; subdivisionCode?: string; postalCode?: string; city?: string; }
interface SquarePaymentLinkResponse { payment_link?: { url?: string; id?: string; order_id?: string }; errors?: { category: string; code: string; detail?: string }[]; }
function isAllowedSquareCheckoutHost(hostname:string){return hostname==="squareup.com"||hostname.endsWith(".squareup.com")||hostname==="square.link"||hostname.endsWith(".square.link")||hostname==="squareupsandbox.com"||hostname.endsWith(".squareupsandbox.com");}
function inferNorthAmericaCountry(currency:string):"US"|"CA"{return currency.trim().toUpperCase()==="CAD"?"CA":"US";}
function squareTaxLineItemEnabled(){return process.env.EDUNANCIAL_SQUARE_TAX_LINE_ITEM_ENABLED==="true";}
function taxEnforcementEnabled(){return process.env.EDUNANCIAL_RUNTIME_TAX_ENFORCEMENT_ENABLED==="true";}

export async function POST(request:Request){
 const start=Date.now(),requestId=getRequestId(request.headers),route="/api/square/payment-link";
 try{
  const ipAddress=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||request.headers.get("x-real-ip")||"unknown";
  const rateLimit=enforcePaymentRateLimit({scope:"square-payment-link",key:ipAddress,maxRequests:20,windowMs:60000});
  if(!rateLimit.allowed){const response=NextResponse.json({success:false,error:"Too many checkout requests. Please wait and retry.",requestId},{status:429});response.headers.set("Retry-After",Math.ceil((rateLimit.resetAt-Date.now())/1000).toString());return attachRequestHeaders(response,requestId);}
  if(!isSquareVerifiedCheckoutEnabled()||!hasPaymentPersistenceConfig())return attachRequestHeaders(NextResponse.json({success:false,error:"Square production checkout is not fully configured.",requestId},{status:503}),requestId);
  await ensureSquareWebhookSubscription();
  const body=(await request.json()) as PaymentLinkRequestBody; const {itemId="",discountCode,customerEmail}=body;
  if(!itemId)return attachRequestHeaders(NextResponse.json({success:false,error:"itemId is required.",requestId},{status:400}),requestId);
  const item=resolveCatalogItem(itemId) ?? await resolveMarketplaceCatalogItem(itemId);
  if(!item)return attachRequestHeaders(NextResponse.json({success:false,error:"The requested item is not available for purchase.",requestId},{status:400}),requestId);
  if(!item.active)return attachRequestHeaders(NextResponse.json({success:false,error:"This item is not currently available for purchase.",requestId},{status:403}),requestId);

  const countryCode=body.countryCode?.trim().toUpperCase()||inferNorthAmericaCountry(item.currency);
  const restrictedMarket=item.metadata?.marketplace_country_code;
  if(restrictedMarket&&restrictedMarket!==countryCode)return attachRequestHeaders(NextResponse.json({success:false,error:`This marketplace item is available only in ${restrictedMarket}.`,countryCode,requiredCountry:restrictedMarket,requestId},{status:403}),requestId);
  const country=getCountryByISO(countryCode);
  if(!country||!isCountryFeatureEnabled(countryCode,"paymentsEnabled"))return attachRequestHeaders(NextResponse.json({success:false,error:`Paid checkout is not enabled for country ${countryCode}.`,countryCode,requestId},{status:403}),requestId);
  if(item.metadata?.marketplace_product_id&&!isCountryFeatureEnabled(countryCode,"marketplaceEnabled"))return attachRequestHeaders(NextResponse.json({success:false,error:`Marketplace purchases are not enabled for country ${countryCode}.`,countryCode,requestId},{status:403}),requestId);
  const itemCurrency=item.currency.trim().toUpperCase();
  const countryCurrency=country.currency.trim().toUpperCase();
  if(itemCurrency!==countryCurrency)return attachRequestHeaders(NextResponse.json({success:false,error:`The selected item is priced in ${itemCurrency}, but ${country.country} checkout requires ${countryCurrency}. A country-specific catalog price must be configured before payment can proceed.`,countryCode,catalogCurrency:itemCurrency,requiredCurrency:countryCurrency,requestId},{status:409}),requestId);

  let countryControl:{countryCode:string;launchState:string};
  try{countryControl=await assertCountryOperationAllowed(countryCode,["ACTIVE","BETA"]);}catch(error){const message=error instanceof Error?error.message:"Checkout is not enabled for this country.";return attachRequestHeaders(NextResponse.json({success:false,error:message,countryCode,requestId},{status:403}),requestId);}
  if(countryControl.countryCode!=="US"&&countryControl.countryCode!=="CA")return attachRequestHeaders(NextResponse.json({success:false,error:`Country ${countryControl.countryCode} is enabled, but Square is not an approved payment provider for this market.`,countryCode:countryControl.countryCode,paymentProvider:"square",requestId},{status:409}),requestId);

  let finalPrice=item.price,discountApplied=false,discountDescription:string|undefined;
  if(discountCode?.trim()){const discountResult=applyDiscountCode(discountCode,item.id,item.price,item.currency);if(!discountResult.valid)return attachRequestHeaders(NextResponse.json({success:false,error:discountResult.errorMessage??"Invalid discount code.",requestId},{status:400}),requestId);finalPrice=Math.max(0,discountResult.finalPrice);discountApplied=true;discountDescription=discountResult.code?.description;}

  let taxMinor=0,jurisdictionKey="",taxRuleVersion="",taxRegistrationAccountRef="",taxStatus="rollout-disabled";
  if(taxEnforcementEnabled()){
   const taxResolution=await resolveCheckoutTax({countryCode:countryControl.countryCode,subdivisionCode:body.subdivisionCode,postalCode:body.postalCode,city:body.city,itemType:item.type,subtotalMinor:Math.round(finalPrice*100),currency:item.currency});
   if(taxResolution.status==="location-required")return attachRequestHeaders(NextResponse.json({success:false,error:taxResolution.reason,taxStatus:taxResolution.status,requestId},{status:422}),requestId);
   if(taxResolution.status==="manual-review-required")return attachRequestHeaders(NextResponse.json({success:false,error:taxResolution.decision.quote.reason,taxStatus:taxResolution.status,jurisdictionKey:taxResolution.decision.quote.jurisdictionKey,requestId},{status:409}),requestId);
   const taxDecision=taxResolution.decision; taxMinor=taxDecision.quote.tax.amountMinor;jurisdictionKey=taxDecision.quote.jurisdictionKey;taxRuleVersion=taxDecision.ruleVersion??taxDecision.quote.ruleVersionId??"";taxRegistrationAccountRef=taxDecision.registrationAccountRef??"";taxStatus=taxDecision.quote.status??"calculated";
   if(taxMinor>0&&!squareTaxLineItemEnabled())return attachRequestHeaders(NextResponse.json({success:false,error:"Tax was calculated, but Square tax charging is not yet enabled for this deployment. Checkout is blocked to prevent under-collection.",taxStatus:"charge-adapter-disabled",taxMinor,currency:item.currency.toUpperCase(),jurisdictionKey,requestId},{status:503}),requestId);
  }

  const squareApiBase=squareConfig.environment==="sandbox"?"https://connect.squareupsandbox.com":"https://connect.squareup.com",appOrigin=new URL(request.url).origin,currency=item.currency.toUpperCase();
  const lineItems:Array<Record<string,unknown>>=[{name:item.name,quantity:"1",base_price_money:{amount:Math.round(item.price*100),currency}}];
  if(taxMinor>0)lineItems.push({name:`Tax — ${jurisdictionKey}`,quantity:"1",base_price_money:{amount:taxMinor,currency}});
  const orderDiscounts=discountApplied?[{name:discountDescription??"Promotional Discount",type:"FIXED_AMOUNT",amount_money:{amount:Math.round((item.price-finalPrice)*100),currency}}]:undefined;
  const successParams=new URLSearchParams({item:item.id,type:item.type,country:countryControl.countryCode,...(item.membershipPlanId?{plan:item.membershipPlanId}:{}),...(item.contentId?{content:item.contentId}:{})});
  const metadata:Record<string,string>={catalog_item_id:item.id,item_type:item.type,country_code:countryControl.countryCode,country_launch_state:countryControl.launchState,tax_status:taxStatus,...(item.membershipPlanId?{membership_plan_id:item.membershipPlanId}:{}),...(item.contentId?{content_id:item.contentId}:{}),...(discountCode?{discount_code:discountCode}:{}),...(item.metadata??{})};
  if(taxEnforcementEnabled()){metadata.tax_collected_minor=String(taxMinor);metadata.tax_jurisdiction_code=body.subdivisionCode?.trim().toUpperCase()||jurisdictionKey;metadata.tax_rule_version=taxRuleVersion;metadata.tax_registration_account_ref=taxRegistrationAccountRef;}
  const idempotencyKey=`${requestId}-${item.id}`;
  const squarePayload:Record<string,unknown>={idempotency_key:idempotencyKey,order:{location_id:squareConfig.locationId,line_items:lineItems,...(orderDiscounts?{discounts:orderDiscounts}:{}),metadata},checkout_options:{redirect_url:`${appOrigin}/payment/success?${successParams.toString()}`},pre_populated_data:customerEmail?{buyer_email:customerEmail}:undefined};
  const squareResponse=await fetch(`${squareApiBase}/v2/online-checkout/payment-links`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+squareConfig.accessToken,"Square-Version":"2026-07-15"},body:JSON.stringify(squarePayload)});
  if(!squareResponse.ok){const errBody=(await squareResponse.json().catch(()=>({}))) as SquarePaymentLinkResponse;throw new Error(`Square API error ${squareResponse.status}: ${errBody.errors?.[0]?.detail??squareResponse.statusText}`);}
  const squareData=(await squareResponse.json()) as SquarePaymentLinkResponse,checkoutUrl=squareData.payment_link?.url;if(!checkoutUrl)throw new Error("Square did not return a checkout URL.");const parsedUrl=new URL(checkoutUrl);if(parsedUrl.protocol!=="https:"||!isAllowedSquareCheckoutHost(parsedUrl.hostname))throw new Error("Square returned a non-HTTPS or unexpected checkout URL.");

  await persistCheckoutInitiation({item,customerEmail,amountRequested:finalPrice+(taxMinor/100),currency:item.currency,discountCode,discountAmount:item.price-finalPrice,squarePaymentLinkId:squareData.payment_link?.id,squareOrderId:squareData.payment_link?.order_id,idempotencyKey,metadata:{requestId,itemType:item.type,countryCode:countryControl.countryCode,countryLaunchState:countryControl.launchState,taxStatus,taxMinor,jurisdictionKey:jurisdictionKey||null}});
  if(discountApplied&&discountCode)recordDiscountRedemption(discountCode);
  const response=NextResponse.json({success:true,checkoutUrl,countryCode:countryControl.countryCode,jurisdictionKey:jurisdictionKey||undefined,taxMinor,taxCurrency:currency,taxStatus,itemId:item.id,itemType:item.type,planId:item.membershipPlanId,contentId:item.contentId,originalPrice:item.price,finalPrice,discountApplied,squarePaymentLinkId:squareData.payment_link?.id,squareOrderId:squareData.payment_link?.order_id,requestId});recordRequestMetric({method:request.method,route,status:200,durationMs:Date.now()-start});return attachRequestHeaders(response,requestId);
 }catch(error){logStructuredError(error,{...getRequestContext(request,requestId),route});const response=NextResponse.json({success:false,error:"Square checkout could not be activated. Verified payment, persistence, and tax prerequisites must succeed before payment is accepted.",requestId},{status:503});recordRequestMetric({method:request.method,route,status:503,durationMs:Date.now()-start});return attachRequestHeaders(response,requestId);}
}
