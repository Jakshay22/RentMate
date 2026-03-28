import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import TenantList from "../components/tenant/TenantList";
import TenantForm from "../components/tenant/TenantForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { useAuthContext } from "../context/AuthContext";

export default function Tenants() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#111827]">Tenants</h1>
            <p className="mt-1 text-sm text-[#6b7280]">Property details are stored on each tenant.</p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <UserPlus className="h-4 w-4" strokeWidth={2} />
            Add tenant
          </Button>
        </div>

        <TenantList userId={user?.id} refreshKey={refreshKey} />

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <div className="max-w-md">
            <h3 className="mb-4 text-lg font-semibold text-[#111827]">New tenant</h3>
            <TenantForm
              userId={user?.id}
              onSuccess={() => {
                setOpen(false);
                setRefreshKey((k) => k + 1);
              }}
            />
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
