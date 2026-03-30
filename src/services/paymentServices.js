import { supabase } from "./supabaseClient";
import dayjs from "dayjs";
import { dueDateForBillingMonth } from "../utils/paymentStatus";

const TENANT_SELECT = "name, due_date, property_name, property_address";

export const getPayments = async (userId) => {
  let query = supabase
    .from("payments")
    .select(`*, tenants(${TENANT_SELECT})`);
  // Public mode: allow anonymous visitors to read demo data (no user filter).
  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query
    .order("year", { ascending: false })
    .order("month", { ascending: false });
  if (error) throw error;
  return data;
};

export const markAsPaid = async (paymentId) => {
  const { data, error } = await supabase
    .from("payments")
    .update({ status: "PAID", paid_at: new Date().toISOString() })
    .eq("id", paymentId)
    .select();
  if (error) throw error;
  return data;
};

export const createMonthlyPayments = async (tenantList, month, year, userId) => {
  if (!tenantList?.length) return;

  const { data: existing, error: existingErr } = await supabase
    .from("payments")
    .select("tenant_id")
    .eq("user_id", userId)
    .eq("month", month)
    .eq("year", year);
  if (existingErr) throw existingErr;

  const existingTenantIds = new Set((existing || []).map((p) => p.tenant_id));
  const rows = tenantList
    .map((t) => ({
      tenant_id: t.id,
      user_id: userId,
      amount: t.rent_amount,
      month,
      year,
      status: "UNPAID",
      paid_at: null
    }))
    .filter((r) => !existingTenantIds.has(r.tenant_id));

  if (!rows.length) return;

  const { error } = await supabase.from("payments").insert(rows);
  if (error) throw error;
};

export const syncPaymentStatuses = async (userId) => {
  const now = dayjs();
  const month = now.month() + 1;
  const year = now.year();
  const today = now.startOf("day");

  const { data, error } = await supabase
    .from("payments")
    .select(`id, status, paid_at, tenants!inner(due_date)`)
    .eq("user_id", userId)
    .eq("month", month)
    .eq("year", year);
  if (error) throw error;

  const toLate = [];
  const toUnpaid = [];
  for (const p of data || []) {
    if (p.paid_at || p.status === "PAID") continue;
    const dueDateStr = p.tenants?.due_date;
    const due = dueDateForBillingMonth(dueDateStr, month, year);
    if (!due) continue;
    if (today.isAfter(due, "day")) toLate.push(p.id);
    else toUnpaid.push(p.id);
  }

  if (toLate.length) {
    const { error: lateErr } = await supabase
      .from("payments")
      .update({ status: "LATE" })
      .in("id", toLate);
    if (lateErr) throw lateErr;
  }
  if (toUnpaid.length) {
    const { error: unErr } = await supabase
      .from("payments")
      .update({ status: "UNPAID" })
      .in("id", toUnpaid);
    if (unErr) throw unErr;
  }
};
