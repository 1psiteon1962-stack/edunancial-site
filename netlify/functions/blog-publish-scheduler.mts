import { publishDueBlogArticles } from "../../src/lib/blog/publisher";
export default async () => { const result=await publishDueBlogArticles(); return new Response(JSON.stringify(result),{headers:{"content-type":"application/json"}}); };
export const config={schedule:"*/5 * * * *"};
