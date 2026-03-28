import React from "react";
import { CalendarPlus, MessageCircle } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import PaymentTable from "../components/payment/PaymentTable";
import { useAuthContext } from "../context/AuthContext";
import { createMonthlyPayments, syncPaymentStatuses } from "../services/paymentServices";
import { getTenants } from "../services/tenantServices";
import { triggerReminder } from "../services/reminderServices";
import Button from "../components/ui/Button";

export default function Payments() {
  const { user } = useAuthContext();
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleGenerateMonth = async () => {
    if (!user?.id) return;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    try {
      const tenants = await getTenants(user.id);
      await createMonthlyPayments(tenants || [], month, year, user.id);
      await syncPaymentStatuses(user.id);
      setRefreshKey((k) => k + 1);
      alert("Monthly payments synced.");
    } catch {
      alert("Failed to generate monthly payments.");
    }
  };

  const handleSendReminders = async () => {
    if (!user?.id) return;
    try {
      const data = await triggerReminder(user.id);
      const items = data?.result ?? [];
      const delivered = data?.whatsappSent ?? items.filter((i) => i.whatsapp?.sent).length;
      if (items.length === 0) {
        alert(
          "No reminders ran. Usually this means today is not within the reminder window for your tenants’ due dates, or there are no unpaid payments for this month."
        );
        return;
      }
      const detail = items
        .map((i) => {
          const w = i.whatsapp || {};
          if (w.sent) return `• ${i.reminder_type}: WhatsApp sent (Twilio).`;
          if (w.skipped) {
            const extra = w.error ? ` ${w.error}` : "";
            return `• ${i.reminder_type}: not sent — ${w.reason || "skipped"}${extra}`;
          }
          return `• ${i.reminder_type}: unknown delivery status`;
        })
        .join("\n");
      alert(
        `Reminder attempts: ${items.length}. WhatsApp messages actually sent: ${delivered}.\n\n${detail}\n\nTip: use full international numbers (e.g. +91…). Twilio’s sandbox only delivers after the recipient joins the sandbox.`
      );
    } catch (err) {
      const msg = err?.message || "Failed to trigger reminders.";
      alert(msg);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#111827]">Payments</h1>
            <p className="mt-1 text-sm text-[#6b7280]">Status is based on paid flag and due date for each month.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={handleGenerateMonth}>
              <CalendarPlus className="h-4 w-4" strokeWidth={2} />
              Generate this month
            </Button>
            <Button type="button" variant="primary" onClick={handleSendReminders}>
              <MessageCircle className="h-4 w-4" strokeWidth={2} />
              Send reminders
            </Button>
          </div>
        </div>

        <PaymentTable userId={user?.id} refreshKey={refreshKey} />
      </div>
    </AppLayout>
  );
}
