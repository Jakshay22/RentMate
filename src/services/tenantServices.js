import { supabase } from "./supabaseClient";

export const getTenants = async (userId) => {
  let query = supabase.from("tenants").select("*");
  // Public mode: allow anonymous visitors to read demo data (no user filter).
  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const addTenant = async (tenant) => {
  const { data, error } = await supabase
    .from("tenants")
    .insert([tenant])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateTenant = async (tenantId, payload) => {
  const { data, error } = await supabase
    .from("tenants")
    .update(payload)
    .eq("id", tenantId)
    .select();
  if (error) throw error;
  return data;
};

export const deleteTenant = async (tenantId) => {
  const { error } = await supabase.from("tenants").delete().eq("id", tenantId);
  if (error) throw error;
};