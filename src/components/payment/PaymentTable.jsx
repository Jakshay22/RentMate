import React, { useEffect, useState } from "react";
import { User, Building2, IndianRupee, Calendar, CheckCircle2 } from "lucide-react";
import { getPayments, markAsPaid } from "../../services/paymentServices";
import PaymentStatusBadge from "./PaymentstatusBadge";
import {
  getEffectivePaymentStatus,
  dueDateForBillingMonth,
  formatDateDDMMYYYY
} from "../../utils/paymentStatus";
import { PAYMENT_STATUS } from "../../utils/constants";

export default function PaymentTable({ userId, refreshKey = 0 }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchPayments();
  }, [userId, refreshKey]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getPayments(userId);
      setPayments(data || []);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (paymentId) => {
    try {
      await markAsPaid(paymentId);
      await fetchPayments();
    } catch {
      alert("Failed to mark payment as paid.");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-green-200/80 bg-white/90 p-12 text-center text-sm text-[#6b7280] shadow-sm">
        Loading payments…
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="rounded-2xl border border-dashed border-green-200/80 bg-white p-12 text-center shadow-sm">
        <p className="font-medium text-[#111827]">No payments yet</p>
        <p className="mt-1 text-sm text-[#6b7280]">Generate this month’s payments to see them here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-[#f0fdf4]/60">
              <th className="px-5 py-3.5">
                <span className="inline-flex items-center gap-2 font-semibold text-[#374151]">
                  <User className="h-4 w-4 text-green-600" strokeWidth={2} />
                  Tenant
                </span>
              </th>
              <th className="px-5 py-3.5">
                <span className="inline-flex items-center gap-2 font-semibold text-[#374151]">
                  <Building2 className="h-4 w-4 text-green-600" strokeWidth={2} />
                  Property
                </span>
              </th>
              <th className="px-5 py-3.5">
                <span className="inline-flex items-center gap-2 font-semibold text-[#374151]">
                  <IndianRupee className="h-4 w-4 text-green-600" strokeWidth={2} />
                  Amount
                </span>
              </th>
              <th className="px-5 py-3.5 font-semibold text-[#374151]">Period</th>
              <th className="px-5 py-3.5">
                <span className="inline-flex items-center gap-2 font-semibold text-[#374151]">
                  <Calendar className="h-4 w-4 text-green-600" strokeWidth={2} />
                  Due date
                </span>
              </th>
              <th className="px-5 py-3.5 font-semibold text-[#374151]">Status</th>
              <th className="px-5 py-3.5">
                <span className="inline-flex items-center gap-2 font-semibold text-[#374151]">
                  <CheckCircle2 className="h-4 w-4 text-green-600" strokeWidth={2} />
                  Action
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((p) => {
              const tenant = p.tenants;
              const effective = tenant
                ? getEffectivePaymentStatus(p, tenant)
                : PAYMENT_STATUS.UNPAID;
              const due = tenant?.due_date
                ? dueDateForBillingMonth(tenant.due_date, p.month, p.year)
                : null;
              const isPaid = effective === PAYMENT_STATUS.PAID;

              return (
                <tr
                  key={p.id}
                  className="transition-all duration-200 hover:bg-green-50/50"
                >
                  <td className="px-5 py-4 font-medium text-[#111827]">{tenant?.name ?? "—"}</td>
                  <td
                    className="max-w-[200px] truncate px-5 py-4 text-[#6b7280]"
                    title={tenant?.property_name}
                  >
                    {tenant?.property_name ?? "—"}
                  </td>
                  <td className="px-5 py-4 font-medium tabular-nums text-[#111827]">
                    ₹ {Number(p.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-4 text-[#6b7280]">
                    {String(p.month).padStart(2, "0")}/{p.year}
                  </td>
                  <td className="px-5 py-4 text-[#6b7280]">{due ? formatDateDDMMYYYY(due) : "—"}</td>
                  <td className="px-5 py-4">
                    <PaymentStatusBadge status={effective} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      disabled={isPaid}
                      onClick={() => handleMarkPaid(p.id)}
                      className={[
                        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                        isPaid
                          ? "cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-green-600 text-white shadow-sm hover:bg-green-700"
                      ].join(" ")}
                    >
                      {isPaid ? "Paid" : "Mark as paid"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
