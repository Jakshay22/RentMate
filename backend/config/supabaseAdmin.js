const { createClient } = require("@supabase/supabase-js");
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require("./env");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Keep server booting; endpoints return actionable errors.
  console.warn(
    "[backend] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Reminder APIs will fail until configured."
  );
}

const supabaseAdmin = createClient(SUPABASE_URL || "https://invalid.local", SUPABASE_SERVICE_ROLE_KEY || "invalid");

module.exports = { supabaseAdmin };

