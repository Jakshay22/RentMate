import dayjs from "dayjs";
import { PAYMENT_STATUS } from "./constants";

/**
 * Calendar due date for a tenant's rent in a given billing month/year.
 * Clamps day-of-month to the month's last day (e.g. 31 → Feb 28).
 */
export function dueDateForBillingMonth(tenantDueDate, month, year) {
  if (!tenantDueDate) return null;
  const day = dayjs(tenantDueDate).date();
  const lastDay = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).endOf("month").date();
  const d = Math.min(day, lastDay);
  return dayjs(
    `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
  ).startOf("day");
}

/**
 * PAID if stored paid; else LATE if today is after due date; else UNPAID.
 */
export function getEffectivePaymentStatus(payment, tenant) {
  if (!payment || !tenant) return PAYMENT_STATUS.UNPAID;
  if (payment.status === PAYMENT_STATUS.PAID || payment.paid_at) {
    return PAYMENT_STATUS.PAID;
  }
  const due = dueDateForBillingMonth(tenant.due_date, payment.month, payment.year);
  if (!due) return PAYMENT_STATUS.UNPAID;
  const today = dayjs().startOf("day");
  if (today.isAfter(due, "day")) return PAYMENT_STATUS.LATE;
  return PAYMENT_STATUS.UNPAID;
}

export function formatDateDDMMYYYY(value) {
  if (!value) return "—";
  const d = dayjs(value);
  return d.isValid() ? d.format("DD/MM/YYYY") : "—";
}
