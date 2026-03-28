import { createClient } from "@supabase/supabase-js";

const cleanEnv = (value = "") =>
  String(value)
    .trim()
    .replace(/^=+/, "")
    .replace(/^['"]|['"]$/g, "")
    .replace(/^VITE_SUPABASE_ANON_KEY=/, "")
    .replace(/^SUPABASE_ANON_KEY=/, "");

const SUPABASE_URL = cleanEnv(import.meta.env.VITE_SUPABASE_URL);
const SUPABASE_ANON_KEY = cleanEnv(import.meta.env.VITE_SUPABASE_ANON_KEY);
const isValidUrl = /^https?:\/\/.+/i.test(SUPABASE_URL);

// Avoid crashing the app on startup when env vars are not configured yet.
// The UI will still render, but Supabase-dependent actions will fail gracefully.
export const supabase =
  isValidUrl && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

export const supabaseConfigMissing = !supabase;