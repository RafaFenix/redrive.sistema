import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://sybivceqpgdcuyqotyzo.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_4FXn3G_k5Qw0VEIz6sf9Bw_pwHG57oi";

let supabaseClient: SupabaseClient | undefined;

function readSupabaseConfig(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getViteEnvValue(key: string) {
  const viteEnv = import.meta.env as Record<string, unknown> | undefined;
  return viteEnv?.[key];
}

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = readSupabaseConfig(
    getViteEnvValue("VITE_SUPABASE_URL"),
    FALLBACK_SUPABASE_URL,
  );
  const publishableKey = readSupabaseConfig(
    getViteEnvValue("VITE_SUPABASE_PUBLISHABLE_KEY"),
    FALLBACK_SUPABASE_PUBLISHABLE_KEY,
  );

  supabaseClient = createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseClient;
}
