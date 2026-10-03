import { getNeonSql } from "@/lib/db/neon";

export type MarketingDraftInput = {
  campaignId:string;
  canonicalMessage:string;
  locale?:string;
  sourceType?:string;
  sourceRef?:string;
};

export async function queueMarketingDraft(input:MarketingDraftInput){
 const sql=getNeonSql(); if(!sql) throw new Error("Marketing generation queue requires a database connection.");
 const campaigns=await sql`select id,status,target_locales from marketing_campaigns where id=${input.campaignId} limit 1`;
 const campaign=campaigns[0]; if(!campaign) throw new Error("Campaign not found.");
 if(["complete","paused"].includes(String(campaign.status))) throw new Error("Campaign is not accepting new marketing work.");
 const locale=(input.locale??"en-US").trim();
 const allowed=Array.isArray(campaign.target_locales)?campaign.target_locales.map(String):["en-US"];
 if(allowed.length && !allowed.includes(locale)) throw new Error(`Locale ${locale} is not targeted by this campaign.`);
 const message=input.canonicalMessage.trim(); if(message.length<20) throw new Error("Canonical marketing message is too short.");
 const rows=await sql`insert into marketing_content(campaign_id,source_type,source_ref,locale,canonical_message,status)
   values(${input.campaignId},${input.sourceType??"marketing-agent"},${input.sourceRef??null},${locale},${message},'review') returning id,status,locale`;
 return rows[0];
}

function platformCopy(platform:string,message:string){
 const clean=message.trim();
 if(platform==="x") return clean.length<=280?clean:`${clean.slice(0,276).trimEnd()}…`;
 if(platform==="linkedin") return clean;
 if(platform==="instagram") return clean;
 if(platform==="facebook") return clean;
 if(platform==="youtube") return clean;
 if(platform==="tiktok") return clean;
 return clean;
}

export async function expandApprovedMarketingContent(contentId:string){
 const sql=getNeonSql(); if(!sql) throw new Error("Marketing generation queue requires a database connection.");
 const rows=await sql`select id,canonical_message,status from marketing_content where id=${contentId} limit 1`;
 const content=rows[0]; if(!content) throw new Error("Marketing content not found.");
 if(String(content.status)!=="approved") throw new Error("Only approved canonical content can be expanded into platform drafts.");
 const platforms=await sql`select key from marketing_platforms where enabled=true order by key`;
 const created:string[]=[];
 for(const row of platforms){
   const platform=String(row.key); const copy=platformCopy(platform,String(content.canonical_message));
   const inserted=await sql`insert into marketing_publications(content_id,platform,format,platform_copy,status)
     values(${contentId},${platform},'post',${copy},'review')
     on conflict(content_id,platform,format) do nothing returning id`;
   if(inserted[0]?.id) created.push(String(inserted[0].id));
 }
 return {contentId,created,count:created.length};
}
