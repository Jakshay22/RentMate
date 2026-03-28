const twilio = require("twilio");
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER } = require("../config/env");

const enabled = Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_NUMBER);
const client = enabled ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) : null;

const sendWhatsApp = async ({ toPhone, message }) => {
  if (!enabled) {
    return {
      sent: false,
      skipped: true,
      reason: "twilio_not_configured"
    };
  }

  const normalized = String(toPhone || "").trim();
  if (!normalized) {
    return {
      sent: false,
      skipped: true,
      reason: "missing_phone"
    };
  }

  const to = normalized.startsWith("whatsapp:") ? normalized : `whatsapp:${normalized}`;
  const from = TWILIO_WHATSAPP_NUMBER.startsWith("whatsapp:")
    ? TWILIO_WHATSAPP_NUMBER
    : `whatsapp:${TWILIO_WHATSAPP_NUMBER}`;

  try {
    const result = await client.messages.create({
      from,
      to,
      body: message
    });

    return {
      sent: true,
      sid: result.sid
    };
  } catch (err) {
    const msg = err?.message || String(err);
    const code = err?.code || err?.status;
    return {
      sent: false,
      skipped: true,
      reason: "twilio_error",
      error: code ? `${msg} (code ${code})` : msg
    };
  }
};

module.exports = { sendWhatsApp, enabled };

