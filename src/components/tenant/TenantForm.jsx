import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { addTenant } from "../../services/tenantServices";

export default function TenantForm({ onSuccess, userId }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    rent_amount: "",
    due_date: "",
    upi_id: "",
    property_name: "",
    property_address: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Please login first.");
      return;
    }

    const rentAmount = Number.parseFloat(form.rent_amount);
    if (!Number.isFinite(rentAmount) || rentAmount <= 0) {
      alert("Please enter a valid rent amount.");
      return;
    }
    if (!form.due_date) {
      alert("Please choose a due date.");
      return;
    }
    if (!form.property_name?.trim()) {
      alert("Property name is required.");
      return;
    }

    try {
      await addTenant({
        user_id: userId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        rent_amount: rentAmount,
        due_date: form.due_date,
        upi_id: form.upi_id.trim(),
        property_name: form.property_name.trim(),
        property_address: form.property_address?.trim() || null
      });
      onSuccess();
    } catch (err) {
      const msg =
        err?.message ||
        err?.error_description ||
        err?.hint ||
        "Failed to add tenant.";
      alert(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Property name"
        name="property_name"
        value={form.property_name}
        onChange={handleChange}
        required
        placeholder="e.g. Maple Apartments — Unit 2B"
      />
      <Input
        label="Property address (optional)"
        name="property_address"
        value={form.property_address}
        onChange={handleChange}
        placeholder="Street, city"
      />
      <Input
        label="Tenant name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Phone (E.164, e.g. +919876543210)"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        required
      />
      <Input
        label="Rent amount (INR)"
        name="rent_amount"
        type="number"
        min="1"
        step="1"
        value={form.rent_amount}
        onChange={handleChange}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#374151]">Due date (repeats monthly)</label>
        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          required
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
        />
        <p className="text-xs text-[#6b7280]">Day-of-month is used for each billing month (shown as DD/MM/YYYY).</p>
      </div>
      <Input
        label="UPI ID"
        name="upi_id"
        value={form.upi_id}
        onChange={handleChange}
        required
      />
      <Button type="submit">Add tenant</Button>
    </form>
  );
}
