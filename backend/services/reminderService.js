const dayjs = require("dayjs");
const { supabaseAdmin } = require("../config/supabaseAdmin");
const { sendWhatsApp } = require("./whatsappService");

const dueDateForBillingMonth = (tenantDueDate, month, year) => {
  const base = dayjs(tenantDueDate);
  if (!base.isValid()) return null;
  const day = base.date();
  const lastDay = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).endOf("month").date();
  const dayNum = Math.min(day, lastDay);
  return dayjs(
    `${year}-${String(month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
  ).startOf("day");
};

const buildPaymentLink = (tenant) => {
  const params = new URLSearchParams({
    pa: tenant.upi_id || "",
    pn: tenant.name || "Landlord",
    am: String(tenant.rent_amount || ""),
    cu: "INR",
    tn: `Rent for ${dayjs().format("MMMM YYYY")}`
  });
  return `upi://pay?${params.toString()}`;
};

const buildReminderMessage = ({ tenant, due, reminderType }) => {
  const dueLabel = due ? due.format("DD/MM/YYYY") : "";
  const introByType = {
    before_due: "Friendly reminder",
    due_today: "Reminder",
    late_due: "Urgent reminder"
  };
  return `${introByType[reminderType] || "Reminder"}: Hello ${tenant.name}, your rent of INR ${tenant.rent_amount} is due on ${dueLabel}. Please pay using this UPI link: ${buildPaymentLink(tenant)}`;
};

const reminderTypeFor = ({ due, today }) => {
  if (!due) return null;
  const dayBefore = due.subtract(1, "day");
  if (today.isSame(dayBefore, "day")) return "before_due";
  if (today.isSame(due, "day")) return "due_today";
  if (today.isAfter(due, "day")) return "late_due";
  return null;
};

const syncLateStatuses = async (userId, month, year) => {
  const today = dayjs().startOf("day");
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("id, status, paid_at, tenants!inner(due_date)")
    .eq("user_id", userId)
    .eq("month", month)
    .eq("year", year);
  if (error) throw error;

  const lateIds = (data || [])
    .filter((p) => {
      if (p.paid_at || p.status === "PAID") return false;
      const due = dueDateForBillingMonth(p.tenants?.due_date, month, year);
      return due && today.isAfter(due, "day");
    })
    .map((p) => p.id);
  if (!lateIds.length) return;

  const { error: updateErr } = await supabaseAdmin
    .from("payments")
    .update({ status: "LATE" })
    .in("id", lateIds);
  if (updateErr) throw updateErr;
};

const runDailyRemindersForUser = async (userId) => {
  const now = dayjs();
  const month = now.month() + 1;
  const year = now.year();
  const today = now.startOf("day");

  await syncLateStatuses(userId, month, year);

  const { data: payments, error } = await supabaseAdmin
    .from("payments")
    .select(
      "id, amount, status, paid_at, tenant_id, tenants!inner(name, phone, due_date, upi_id, rent_amount)"
    )
    .eq("user_id", userId)
    .eq("month", month)
    .eq("year", year)
    .neq("status", "PAID");
  if (error) throw error;

  const results = [];
  for (const payment of payments || []) {
    const tenant = payment.tenants;
    const due = dueDateForBillingMonth(tenant?.due_date, month, year);
    const reminderType = reminderTypeFor({ due, today });
    if (!reminderType) continue;

    const message = buildReminderMessage({ tenant, due, reminderType });
    const whatsapp = await sendWhatsApp({
      toPhone: tenant?.phone,
      message
    });

    await supabaseAdmin.from("reminder_logs").insert([
      {
        user_id: userId,
        payment_id: payment.id,
        tenant_id: payment.tenant_id,
        reminder_type: reminderType,
        channel: "whatsapp",
        status: whatsapp.sent ? "sent" : "skipped",
        provider_message_id: whatsapp.sid || null
      }
    ]);

    results.push({
      payment_id: payment.id,
      tenant_id: payment.tenant_id,
      reminder_type: reminderType,
      whatsapp
    });
  }
  return results;
};

const runDailyRemindersForAllUsers = async () => {
  const { data: users, error } = await supabaseAdmin.from("tenants").select("user_id");
  if (error) throw error;

  const userIds = [...new Set((users || []).map((u) => u.user_id).filter(Boolean))];
  const all = [];
  for (const userId of userIds) {
    const result = await runDailyRemindersForUser(userId);
    all.push({ user_id: userId, count: result.length });
  }
  return all;
};

module.exports = { runDailyRemindersForUser, runDailyRemindersForAllUsers };
