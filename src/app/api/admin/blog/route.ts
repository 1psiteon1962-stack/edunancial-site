import { NextRequest } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { validateBlogArticlePackage, type BlogArticlePackage } from "@/lib/blog/article-package";
import { createBlogDraft, listAdminBlogArticles } from "@/lib/blog/admin-repository";

export async function GET(request:NextRequest){const auth=await requireAdminApiSession(request);if(!auth.ok)return auth.response;return Response.json({articles:await listAdminBlogArticles()},{headers:{"Cache-Control":"private, no-store"}});}
export async function POST(request:NextRequest){const auth=await requireAdminApiSession(request,true);if(!auth.ok)return auth.response;const value=await request.json();const errors=validateBlogArticlePackage(value);if(errors.length)return Response.json({error:"Invalid article package",errors},{status:400});try{return Response.json({ok:true,...await createBlogDraft(value as BlogArticlePackage,auth.session.email)},{status:201});}catch(e){return Response.json({error:e instanceof Error?e.message:"Draft creation failed."},{status:400});}}
