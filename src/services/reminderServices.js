import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8787";

function reminderErrorMessage(error) {
  const data = error?.response?.data;
  if (data && typeof data.error === "string") return data.error;
  if (data && typeof data.message === "string") return data.message;
  if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
    return [
      "Cannot reach the reminder API.",
      "Set VITE_BACKEND_URL to your deployed backend URL (https://…), rebuild the frontend,",
      "and ensure the backend is running with SUPABASE_SERVICE_ROLE_KEY."
    ].join(" ");
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
