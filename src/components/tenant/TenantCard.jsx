import React from "react";
import { Phone, IndianRupee, Calendar } from "lucide-react";
import { PAYMENT_STATUS } from "../../utils/constants";
import { formatDateDDMMYYYY, getEffectivePaymentStatus } from "../../utils/paymentStatus";

function initialLetter(name) {
  const s = String(name || "?").trim();
  return s ? s.charAt(0).toUpperCase() : "?";
}

export default function TenantCard({ tenant, payment }) {
  if (!tenant) return null;

  const effective = payment ? getEffectivePaymentStatus(payment, tenant) : null;

  const badgeClass =
    effective === PAYMENT_STATUS.PAID
      ? "bg-green-600 text-white ring-1 ring-green-600/20"
      : effective === PAYMENT_STATUS.LATE
        ? "bg-amber-100 text-amber-900 ring-1 ring-amber-200"
        : effective === PAYMENT_STATUS.UNPAID
          ? "bg-red-50 text-red-800 ring-1 ring-red-200"
          : "bg-gray-100 text-gray-600 ring-1 ring-gray-200";

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-green-100 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-lg font-bold text-white shadow-sm"
            aria-hidden
          >
            {initialLetter(tenant.name)}
          </div>
          <div className="min-w-0 space-y-2">
            <div className="text-base font-semibold text-[#111827] truncate">{tenant.name || "—"}</div>
            <div className="text-sm">
              <span className="font-bold text-[#111827]">{tenant.property_name || "—"}</span>
              {tenant.property_address ? (
                <span className="mt-0.5 block font-normal text-[#6b7280]">{tenant.property_address}</span>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6b7280]">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4 shrink-0 text-green-600" strokeWidth={2} />
                {tenant.phone || "—"}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-800 ring-1 ring-green-100">
              <IndianRupee className="h-4 w-4 text-green-600" strokeWidth={2} />
              ₹{tenant.rent_amount ?? "—"}
              <span className="font-normal text-[#6b7280]">/ month</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6b7280]">
              <Calendar className="h-3.5 w-3.5 text-green-600" strokeWidth={2} />
              <span>Due pattern: {formatDateDDMMYYYY(tenant.due_date)}</span>
              <span className="text-gray-300">·</span>
              <span>UPI: {tenant.upi_id || "—"}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 sm:pt-1">
          {effective ? (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeClass}`}
            >
              {effective}
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-[#6b7280] ring-1 ring-gray-200">
              No payment this month
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
