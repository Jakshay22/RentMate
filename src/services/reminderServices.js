import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8787";

export const triggerReminder = async (userId) => {
  const { data } = await axios.post(`${API_BASE}/api/reminders/send`, { userId });
  return data;
};

export const triggerAllReminders = async () => {
  const { data } = await axios.post(`${API_BASE}/api/reminders/run-all`);
  return data;
};
