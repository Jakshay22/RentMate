import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8787";

function reminderErrorMessage(error) {
  const status = error?.response?.status;
  if (status === 405) {
    return [
      "405 Method Not Allowed: the reminder URL is not your Express backend.",
      "Set VITE_BACKEND_URL to the server where backend/server.js runs (e.g. Render/Railway URL),",
      "not your frontend site (Vercel/Netlify). Rebuild the frontend after changing it."
    ].join(" ");
  }
  const data = error?.response?.data;
  if (data && typeof data.error === "string") return data.error;
  if (data && typeof data.message === "string") return data.message;
  if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
    const usingLocalhost = String(API_BASE).includes("localhost");
    const mixedContent =
      typeof window !== "undefined" &&
      window.location?.protocol === "https:" &&
      String(API_BASE).startsWith("http:");
    const bits = [
      "Cannot reach the reminder API.",
      `This build calls: ${API_BASE}`,
      usingLocalhost
        ? "VITE_BACKEND_URL was probably not set when the site was built (Vite bakes it in at build time)."
        : null,
      mixedContent
        ? "Use an https:// backend URL — an https:// page cannot call http:// (browser blocks it)."
        : null,
      "In Vercel/hosting: add VITE_BACKEND_URL=https://your-railway-app.up.railway.app (no path), then redeploy the frontend.",
      "Backend must be running (Railway/Render) with SUPABASE_SERVICE_ROLE_KEY set."
    ].filter(Boolean);
    return bits.join(" ");
  }
  if (error?.message) return error.message;
  return "Request failed.";
}

export const triggerReminder = async (userId) => {
  try {
    const { data } = await axios.post(`${API_BASE}/api/reminders/send`, { userId });
    return data;
  } catch (err) {
    const message = reminderErrorMessage(err);
    const e = new Error(message);
    e.cause = err;
    throw e;
  }
};

export const triggerAllReminders = async () => {
  try {
    const { data } = await axios.post(`${API_BASE}/api/reminders/run-all`);
    return data;
  } catch (err) {
    const message = reminderErrorMessage(err);
    const e = new Error(message);
    e.cause = err;
    throw e;
  }
};
