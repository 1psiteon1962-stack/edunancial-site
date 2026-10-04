import type { NextRequest } from "next/server";

export async function authorizeGithubActionsRun(request:NextRequest,allowedEvents:readonly string[]):Promise<boolean>{
 const auth=request.headers.get("authorization")??"";
 const token=auth.startsWith("Bearer ")?auth.slice(7).trim():"";
 const repository=request.headers.get("x-github-repository")??"";
 const runId=request.headers.get("x-github-run-id")??"";
 const expected=`${process.env.EDUNANCIAL_GITHUB_OWNER}/${process.env.EDUNANCIAL_GITHUB_REPO}`;
 if(!token||!runId||repository!==expected)return false;
 const response=await fetch(`https://api.github.com/repos/${expected}/actions/runs/${encodeURIComponent(runId)}`,{headers:{Authorization:`Bearer ${token}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},cache:"no-store"});
 if(!response.ok)return false;
 const run=await response.json() as {head_branch?:string;event?:string;status?:string;repository?:{full_name?:string}};
 return run.repository?.full_name===expected&&run.head_branch==="main"&&allowedEvents.includes(run.event??"")&&run.status==="in_progress";
}
