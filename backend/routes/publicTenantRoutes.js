const express = require("express");
const { supabaseAdmin } = require("../config/supabaseAdmin");

const router = express.Router();

const ensureDemoUser = async () => {
  const demoEmail = process.env.DEMO_USER_EMAIL || "public@rentmate.local";
  const demoPassword = process.env.DEMO_USER_PASSWORD || "Temp!ChangeMe1234567890";

  const emailLower = demoEmail.toLowerCase();

  // Try to find the user across a few pages (listUsers returns paginated results).
  const perPage = 50;
  for (let page = 1; page <= 10; page++) {
    const listRes = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    const users = listRes?.data?.users || [];
    const found = users.find((u) => String(u?.email || "").toLowerCase() === emailLower);
    if (found?.id) return found.id;
    if (users.length < perPage) break;
  }

  // If not found, create a new one.
  try {
    const createRes = await supabaseAdmin.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true
    });

    return createRes?.data?.user?.id || createRes?.data?.id;
  } catch (createErr) {
    // If it already exists (race condition), try listing again once more.
    const listRes = await supabaseAdmin.auth.admin.listUsers({ perPage, page: 1 });
    const users = listRes?.data?.users || [];
    const found = users.find((u) => String(u?.email || "").toLowerCase() === emailLower);
    if (found?.id) return found.id;
    throw createErr;
  }
};

router.post("/tenants/add", async (req, res) => {
  try {
    const {
      name,
      phone,
      rent_amount,
      due_date,
      upi_id,
      property_name,
      property_address
    } = req.body || {};

    if (!name || !String(name).trim()) return res.status(400).json({ error: "name is required" });
    if (!phone || !String(phone).trim()) return res.status(400).json({ error: "phone is required" });
    const rentAmount = Number.parseFloat(rent_amount);
    if (!Number.isFinite(rentAmount) || rentAmount <= 0)
      return res.status(400).json({ error: "rent_amount must be a positive number" });
    if (!due_date || !String(due_date).trim()) return res.status(400).json({ error: "due_date is required" });
    if (!property_name || !String(property_name).trim())
      return res.status(400).json({ error: "property_name is required" });
    if (!upi_id || !String(upi_id).trim()) return res.status(400).json({ error: "upi_id is required" });

    const demoUserId = await ensureDemoUser();
    if (!demoUserId) return res.status(500).json({ error: "Failed to initialize demo user" });

    const { data: tenant, error: tenantErr } = await supabaseAdmin
      .from("tenants")
      .insert([
        {
          user_id: demoUserId,
          name: String(name).trim(),
          phone: String(phone).trim(),
          rent_amount: rentAmount,
          due_date: due_date,
          upi_id: String(upi_id).trim(),
          property_name: String(property_name).trim(),
          property_address: property_address ? String(property_address).trim() : null
        }
      ])
      .select()
      .single();

    if (tenantErr) throw tenantErr;

    // Create (or ensure) current month payment for this tenant
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("id")
      .eq("tenant_id", tenant.id)
      .eq("month", month)
      .eq("year", year)
      .maybeSingle();

    if (!existingPayment?.id) {
      await supabaseAdmin.from("payments").insert([
        {
          user_id: demoUserId,
          tenant_id: tenant.id,
          amount: rentAmount,
          month,
          year,
          status: "UNPAID",
          paid_at: null
        }
      ]);
    } else {
      await supabaseAdmin
        .from("payments")
        .update({ amount: rentAmount, status: "UNPAID", paid_at: null })
        .eq("id", existingPayment.id);
    }

    return res.json({ ok: true, tenant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Failed to add tenant" });
  }
});

module.exports = router;

