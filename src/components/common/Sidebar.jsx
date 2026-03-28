import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Wallet, Building2 } from "lucide-react";
import { ROUTES } from "../../utils/constants";

const items = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.TENANTS, label: "Tenants", icon: Users },
  { to: ROUTES.PAYMENTS, label: "Payments", icon: Wallet }
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-hidden border-r border-gray-200 bg-white p-6 shadow-sm">
      <div className="relative z-10 mb-8 text-lg font-semibold tracking-tight text-[#111827]">RentMate</div>

      <nav className="relative z-10 flex min-h-0 flex-1 flex-col gap-1 pb-36">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-[#6b7280] hover:bg-green-50/80 hover:text-[#111827]"
              ].join(" ")
            }
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <Building2
        className="pointer-events-none absolute bottom-5 left-5 z-0 max-h-[120px] max-w-[120px] text-green-600 opacity-[0.60]"
        strokeWidth={1}
        width={120}
        height={120}
        aria-hidden
      />
    </aside>
  );
}
