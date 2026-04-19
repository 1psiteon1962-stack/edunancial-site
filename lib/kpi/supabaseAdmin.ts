// lib/kpi/supabaseAdmin.ts

import { createClient } from "@supabase/supabase-js";

// ✅ SAFE ENV HANDLING (prevents Netlify build crash)
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "public-anon-key";

// ✅ CREATE CLIENT SAFELY
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);
