import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import { getTenants } from "../services/tenantServices";
import { getPayments } from "../services/paymentServices";
import { getEffectivePaymentStatus } from "../utils/paymentStatus";

const initial = {
  tenants: 0,
  expectedRent: 0,
  paidAmount: 0,
  unpaidAmount: 0,
  lateCount: 0,
  lateAmount: 0
};

export default function useDashboardStats(userId) {
  const [stats, setStats] = useState(initial);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tenants, payments] = await Promise.all([
        getTenants(userId),
        getPayments(userId)
      ]);
      const month = dayjs().month() + 1;
      const year = dayjs().year();
      const byTenant = Object.fromEntries((tenants || []).map((t) => [t.id, t]));
      const monthPayments = (payments || []).filter((p) => p.month === month && p.year === year);

      let expectedRent = 0;
      let paidAmount = 0;
      let unpaidAmount = 0;
      let lateAmount = 0;
      let lateCount = 0;

      for (const p of monthPayments) {
        const t = byTenant[p.tenant_id];
        if (!t) continue;
        const amt = Number(p.amount || 0);
        expectedRent += amt;
        const eff = getEffectivePaymentStatus(p, t);
        if (eff === "PAID") paidAmount += amt;
        else if (eff === "LATE") {
          lateCount += 1;
          lateAmount += amt;
        } else unpaidAmount += amt;
      }

      setStats({
        tenants: (tenants || []).length,
        expectedRent,
        paidAmount,
        unpaidAmount,
        lateCount,
        lateAmount
      });
    } catch {
      setStats(initial);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, refresh: load };
}
