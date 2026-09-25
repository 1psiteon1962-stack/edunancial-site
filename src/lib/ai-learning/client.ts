export async function trackLearnerEvent(input: { eventName:string; lessonId?:string; track?:string; level?:number; locale?:string; metadata?:Record<string,unknown> }, csrfToken?:string|null) {
  if (!csrfToken) return;
  try { await fetch("/api/ai-learning/events",{method:"POST",headers:{"Content-Type":"application/json","x-csrf-token":csrfToken},body:JSON.stringify(input)}); } catch {}
}
export async function saveLearnerAIPreferences(input: Record<string,unknown>, csrfToken?:string|null) {
  if (!csrfToken) return false;
  const r=await fetch("/api/ai-learning/preferences",{method:"PUT",headers:{"Content-Type":"application/json","x-csrf-token":csrfToken},body:JSON.stringify(input)});
  return r.ok;
}
