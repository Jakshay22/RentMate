import React from "react";
import { useAuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuthContext();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="flex h-14 items-center justify-between px-6">
        <span className="text-base font-semibold text-[#111827]">RentMate</span>
        <div className="flex items-center gap-4">
          <span className="max-w-[220px] truncate text-sm text-[#6b7280]">
            {user?.email || "Guest"}
          </span>
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-sm transition-all duration-200 hover:border-green-200 hover:bg-green-50/80"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
