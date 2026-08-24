"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getPrivacyRegistrationDecision } from "@/lib/age-consent";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { validatePassword } from "@/lib/auth/password";
import type { AuthResult, AuthUser, PasswordUpdateResult, RegisterData, SessionPayload } from "@/lib/auth/types";

interface AuthContextValue {
  user: AuthUser | null; loading: boolean; csrfToken: string | null;
  login: (email: string, password: string, betaPassNumber?: string) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>; logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<AuthResult>; refreshSession: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthResult>; updatePassword: (newPassword: string) => Promise<PasswordUpdateResult>;
  signOutOtherSessions: () => Promise<AuthResult>; passwordErrors: (password: string) => string[];
}
const AuthContext = createContext<AuthContextValue | null>(null);
async function fetchSession(): Promise<SessionPayload> { const r = await fetch("/api/member/session", { cache: "no-store" }); return r.ok ? (await r.json()) as SessionPayload : { authenticated:false,user:null,csrfToken:null }; }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,setUser]=useState<AuthUser|null>(null); const [csrfToken,setCsrfToken]=useState<string|null>(null); const [loading,setLoading]=useState(true);
  const refreshSession=useCallback(async()=>{const s=await fetchSession();setUser(s.user);setCsrfToken(s.csrfToken);},[]);
  useEffect(()=>{const s=getSupabaseBrowserClient();void refreshSession().finally(()=>setLoading(false));const {data:{subscription}}=s.auth.onAuthStateChange(()=>void refreshSession());return()=>subscription.unsubscribe();},[refreshSession]);
  const login=useCallback(async(email:string,password:string):Promise<AuthResult>=>{const s=getSupabaseBrowserClient();const {error}=await s.auth.signInWithPassword({email,password});if(error)return{success:false,error:error.message};await refreshSession();await fetch("/api/auth/sync-membership",{method:"POST"}).catch(()=>undefined);return{success:true};},[refreshSession]);
  const register=useCallback(async(data:RegisterData):Promise<AuthResult>=>{const errors=validatePassword(data.password);if(errors.length)return{success:false,error:errors.join(". ")};const decision=getPrivacyRegistrationDecision(data.country,data.dateOfBirth);if(!decision.allowed)return{success:false,error:decision.reason==="manual-review"?"A parent or legal guardian must contact Edunancial before this account can be created.":"Parent or legal-guardian privacy consent is required before this account can be created."};const origin=typeof window!=="undefined"?window.location.origin:"";const s=getSupabaseBrowserClient();const {error}=await s.auth.signUp({email:data.email,password:data.password,options:{emailRedirectTo:`${origin}/auth/confirm?next=/verify-email?verified=1`,data:{first_name:data.firstName,last_name:data.lastName,country:data.country,date_of_birth:data.dateOfBirth}}});if(error)return{success:false,error:error.message};await refreshSession();return{success:true};},[refreshSession]);
  const logout=useCallback(async()=>{const s=getSupabaseBrowserClient();await fetch("/api/member/session",{method:"DELETE",headers:csrfToken?{"x-csrf-token":csrfToken}:undefined}).catch(()=>undefined);await s.auth.signOut();setUser(null);},[csrfToken]);
  const updateProfile=useCallback(async(data:Partial<AuthUser>):Promise<AuthResult>=>{const r=await fetch("/api/member/profile",{method:"PATCH",headers:{"Content-Type":"application/json",...(csrfToken?{"x-csrf-token":csrfToken}:{})},body:JSON.stringify(data)});const p=(await r.json().catch(()=>({}))) as {user?:AuthUser;error?:string};if(!r.ok||!p.user)return{success:false,error:p.error??"Unable to update profile."};setUser(p.user);return{success:true};},[csrfToken]);
  const requestPasswordReset=useCallback(async(email:string):Promise<AuthResult>=>{const r=await fetch("/api/member/password-reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});const p=(await r.json().catch(()=>({}))) as {error?:string};return r.ok?{success:true}:{success:false,error:p.error??"Unable to request password reset."};},[]);
  const updatePassword=useCallback(async(newPassword:string):Promise<PasswordUpdateResult>=>{const errors=validatePassword(newPassword);if(errors.length)return{success:false,error:errors.join(". ")};const s=getSupabaseBrowserClient();const {error}=await s.auth.updateUser({password:newPassword});if(error)return{success:false,error:error.message};await refreshSession();return{success:true};},[refreshSession]);
  const signOutOtherSessions=useCallback(async():Promise<AuthResult>=>{const {error}=await getSupabaseBrowserClient().auth.signOut({scope:"others"});return error?{success:false,error:error.message}:{success:true};},[]);
  const value=useMemo<AuthContextValue>(()=>({user,loading,csrfToken,login,register,logout,updateProfile,refreshSession,requestPasswordReset,updatePassword,signOutOtherSessions,passwordErrors:validatePassword}),[user,loading,csrfToken,login,register,logout,updateProfile,refreshSession,requestPasswordReset,updatePassword,signOutOtherSessions]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth():AuthContextValue{const ctx=useContext(AuthContext);if(!ctx)throw new Error("useAuth must be used within AuthProvider");return ctx;}
export { validatePassword }; export type { AuthUser, RegisterData } from "@/lib/auth/types";
