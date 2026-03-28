import React, { useEffect, useState, useMemo } from "react";
import { Users } from "lucide-react";
import dayjs from "dayjs";
import { getTenants } from "../../services/tenantServices";
import { getPayments } from "../../services/paymentServices";
import TenantCard from "./TenantCard";

export default function TenantList({ userId, refreshKey = 0 }) {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [tData, pData] = await Promise.all([getTenants(userId), getPayments(userId)]);
        if (!cancelled) {
          setTenants(tData || []);
          setPayments(pData || []);
        }
      } catch {
        if (!cancelled) {
          setTenants([]);
          setPayments([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, refreshKey]);

  const paymentByTenant = useMemo(() => {
    const month = dayjs().month() + 1;
    const year = dayjs().year();
    const map = new Map();
    for (const p of payments) {
      if (p.month === month && p.year === year) {
        map.set(p.tenant_id, p);
      }
    }
    return map;
  }, [payments]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-green-200/80 bg-white/90 p-12 text-center text-sm text-[#6b7280] shadow-sm">
        Loading tenants…
      </div>
    );
  }

  if (!tenants.length) {
    return (
      <div className="rounded-2xl border border-dashed border-green-200/80 bg-white p-12 text-center shadow-sm">
        <Users className="mx-auto mb-3 h-10 w-10 text-green-600/40" strokeWidth={1.5} />
        <p className="font-medium text-[#111827]">No tenants yet</p>
        <p className="mt-1 text-sm text-[#6b7280]">Add a tenant to see them listed here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tenants.map((t) => (
        <TenantCard key={t.id} tenant={t} payment={paymentByTenant.get(t.id)} />
      ))}
    </div>
  );
}
