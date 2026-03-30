import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8787";

export const addPublicTenant = async (tenant) => {
  const { data } = await axios.post(`${API_BASE}/api/public/tenants/add`, tenant);
  return data;
};

