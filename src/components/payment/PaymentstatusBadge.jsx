import React from "react";

export default function PaymentStatusBadge({ status }) {
  const base =
    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide transition-all duration-200";

  const styles = {
    PAID: "bg-green-600 text-white ring-1 ring-green-600/30",
    UNPAID: "bg-red-50 text-red-800 ring-1 ring-red-200",
    LATE: "bg-amber-100 text-amber-900 ring-1 ring-amber-200"
  };

  return (
    <span className={`${base} ${styles[status] || "bg-gray-100 text-gray-700 ring-1 ring-gray-200"}`}>
      {status}
    </span>
  );
}
