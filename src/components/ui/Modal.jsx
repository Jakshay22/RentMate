import React from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-[#6b7280] transition-all duration-200 hover:bg-green-50 hover:text-[#111827]"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>
  );
}
