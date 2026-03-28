import React from "react";

export default function Input({ label, ...props }) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? <label className="text-sm font-medium text-[#374151]">{label}</label> : null}
      <input
        {...props}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
      />
    </div>
  );
}
