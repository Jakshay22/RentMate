import React from "react";
import {
  Users,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import TenantList from "../components/tenant/TenantList";
import useDashboardStats from "../hooks/useDashboardStats";

function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-green-100 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-[#111827]">{value}</p>
          {sub ? <p className="mt-1.5 text-xs text-[#6b7280]">{sub}</p> : null}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { stats, loading } = useDashboardStats();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-[#111827]">Overview</h1>
          <p className="mt-1 text-sm text-[#6b7280]">This month’s rent health for your account.</p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-green-200/80 bg-white/80 p-12 text-center text-sm text-[#6b7280] shadow-sm">
            Loading…
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Total tenants" value={stats.tenants} icon={Users} />
            <StatCard
              label="Expected rent (this month)"
              value={`₹ ${stats.expectedRent.toLocaleString("en-IN")}`}
              icon={IndianRupee}
            />
            <StatCard
              label="Paid amount"
              value={`₹ ${stats.paidAmount.toLocaleString("en-IN")}`}
              icon={CheckCircle2}
            />
            <StatCard
              label="Unpaid (on time)"
              value={`₹ ${stats.unpaidAmount.toLocaleString("en-IN")}`}
              icon={Clock}
            />
            <StatCard
              label="Late payments"
              value={stats.lateCount}
              sub={
                stats.lateAmount
                  ? `₹ ${stats.lateAmount.toLocaleString("en-IN")} outstanding`
                  : undefined
              }
              icon={AlertCircle}
            />
          </div>
        )}

        <div>
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">Tenants</h2>
          <TenantList />
        </div>
      </div>
    </AppLayout>
  );
}
