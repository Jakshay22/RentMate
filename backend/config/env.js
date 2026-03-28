const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.BACKEND_PORT || 8787,
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER || "",
  PUBLIC_APP_URL: process.env.VITE_FRONTEND_URL || "http://localhost:5173"
};

