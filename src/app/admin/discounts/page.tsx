"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/admin/DataTable";
import { format } from "date-fns";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  startAt: string | null;
  endAt: string | null;
}

const emptyForm = {
  code: "",
  type: "PERCENTAGE",
  value: "",
  minOrderAmount: "",
  maxDiscount: "",
  usageLimit: "",
  perCustomerLimit: "",
  startAt: "",
  endAt: "",
  isActive: true,
};

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchCoupons() {
    const res = await fetch("/api/admin/discounts");
    setCoupons(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchCoupons(); }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const body = { ...form, id: editingId };

    await fetch("/api/admin/discounts", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    resetForm();
    fetchCoupons();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/discounts?id=${id}`, { method: "DELETE" });
    fetchCoupons();
  }

  function startEdit(coupon: Coupon) {
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount) : "",
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
      perCustomerLimit: "",
      startAt: coupon.startAt ? coupon.startAt.slice(0, 16) : "",
      endAt: coupon.endAt ? coupon.endAt.slice(0, 16) : "",
      isActive: coupon.isActive,
    });
    setEditingId(coupon.id);
    setShowForm(true);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Discounts</h1>
          <p className="text-sm text-muted">Manage coupon codes</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-[var(--card-radius)] border border-border bg-surface p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit" : "New"} Coupon</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-[var(--button-radius)] border border-border bg-background px-4 py-2.5 text-sm text-white"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
            </div>
            <Input label="Value" type="number" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
            <Input label="Min Order Amount" type="number" step="0.01" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
            <Input label="Max Discount" type="number" step="0.01" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
            <Input label="Usage Limit" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
            <Input label="Start" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
            <Input label="End" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-violet" />
              <span className="text-sm text-white">Active</span>
            </label>
          </div>
          <div className="flex gap-3">
            <Button type="submit">{editingId ? "Update" : "Create"}</Button>
            <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="h-48 skeleton rounded-[var(--card-radius)]" />
      ) : (
        <DataTable
          data={coupons}
          keyExtractor={(c) => c.id}
          columns={[
            { key: "code", header: "Code", render: (c) => <span className="font-mono text-lavender">{c.code}</span> },
            {
              key: "value",
              header: "Discount",
              render: (c) => c.type === "PERCENTAGE" ? `${c.value}%` : `€${c.value}`,
            },
            {
              key: "usage",
              header: "Usage",
              render: (c) => `${c.usageCount}${c.usageLimit ? ` / ${c.usageLimit}` : ""}`,
            },
            {
              key: "isActive",
              header: "Status",
              render: (c) => <Badge variant={c.isActive ? "live" : "default"}>{c.isActive ? "Active" : "Inactive"}</Badge>,
            },
            {
              key: "dates",
              header: "Valid",
              render: (c) => (
                <span className="text-xs text-muted">
                  {c.startAt ? format(new Date(c.startAt), "MMM d") : "—"}
                  {" — "}
                  {c.endAt ? format(new Date(c.endAt), "MMM d, yyyy") : "—"}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              render: (c) => (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
