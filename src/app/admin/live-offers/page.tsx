"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Copy, Ban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/admin/DataTable";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { format } from "date-fns";

interface LiveOffer {
  id: string;
  productId: string;
  normalPrice: number;
  salePrice: number;
  discount: number;
  startAt: string;
  endAt: string;
  badge: string | null;
  priority: number;
  enabled: boolean;
  status: string;
  product: { id: string; name: string; slug: string };
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const statusVariant: Record<string, "default" | "live" | "sale" | "new" | "limited"> = {
  DISABLED: "default",
  SCHEDULED: "new",
  ACTIVE: "live",
  EXPIRED: "limited",
};

const emptyForm = {
  productId: "",
  normalPrice: "",
  salePrice: "",
  startAt: "",
  endAt: "",
  badge: "",
  priority: "0",
  enabled: true,
  customTitle: "",
  customDescription: "",
};

export default function AdminLiveOffersPage() {
  const [offers, setOffers] = useState<LiveOffer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const computedDiscount = form.normalPrice && form.salePrice
    ? calculateDiscount(parseFloat(form.normalPrice), parseFloat(form.salePrice))
    : 0;

  async function fetchOffers() {
    const res = await fetch("/api/admin/live-offers");
    setOffers(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchOffers();
    fetch("/api/admin/products").then((r) => r.json()).then(setProducts);
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function handleProductChange(productId: string) {
    const product = products.find((p) => p.id === productId);
    setForm((prev) => ({
      ...prev,
      productId,
      normalPrice: product ? String(product.price) : prev.normalPrice,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const body = {
      ...form,
      id: editingId,
      priority: parseInt(form.priority, 10),
    };

    await fetch("/api/admin/live-offers", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    resetForm();
    fetchOffers();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this offer?")) return;
    await fetch(`/api/admin/live-offers?id=${id}`, { method: "DELETE" });
    fetchOffers();
  }

  async function handleDuplicate(offer: LiveOffer) {
    await fetch("/api/admin/live-offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: offer.productId,
        normalPrice: offer.normalPrice,
        salePrice: offer.salePrice,
        startAt: offer.startAt,
        endAt: offer.endAt,
        badge: offer.badge,
        priority: offer.priority,
        enabled: false,
      }),
    });
    fetchOffers();
  }

  async function handleDisable(offer: LiveOffer) {
    await fetch("/api/admin/live-offers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: offer.id,
        productId: offer.productId,
        normalPrice: offer.normalPrice,
        salePrice: offer.salePrice,
        startAt: offer.startAt,
        endAt: offer.endAt,
        badge: offer.badge,
        priority: offer.priority,
        enabled: false,
      }),
    });
    fetchOffers();
  }

  function startEdit(offer: LiveOffer) {
    setForm({
      productId: offer.productId,
      normalPrice: String(offer.normalPrice),
      salePrice: String(offer.salePrice),
      startAt: offer.startAt.slice(0, 16),
      endAt: offer.endAt.slice(0, 16),
      badge: offer.badge ?? "",
      priority: String(offer.priority),
      enabled: offer.enabled,
      customTitle: "",
      customDescription: "",
    });
    setEditingId(offer.id);
    setShowForm(true);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Offers</h1>
          <p className="text-sm text-muted">Time-limited promotional pricing</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          Create Offer
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-[var(--card-radius)] border border-border bg-surface p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit" : "New"} Live Offer</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Product</label>
              <select
                value={form.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                required
                className="w-full rounded-[var(--button-radius)] border border-border bg-background px-4 py-2.5 text-sm text-white"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {formatPrice(p.price)}</option>
                ))}
              </select>
            </div>
            <Input label="Badge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="LIVE DEAL" />
            <Input label="Normal Price" type="number" step="0.01" value={form.normalPrice} onChange={(e) => setForm({ ...form, normalPrice: e.target.value })} required />
            <Input label="Sale Price" type="number" step="0.01" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} required />
            <div className="flex items-end">
              <div className="rounded-[var(--button-radius)] border border-violet/30 bg-violet/10 px-4 py-2.5">
                <span className="text-xs text-muted">Auto Discount</span>
                <p className="text-lg font-bold text-lavender">{computedDiscount}%</p>
              </div>
            </div>
            <Input label="Priority" type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
            <Input label="Start" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} required />
            <Input label="End" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} required />
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} className="accent-violet" />
              <span className="text-sm text-white">Enabled</span>
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
          data={offers}
          keyExtractor={(o) => o.id}
          columns={[
            {
              key: "product",
              header: "Product",
              render: (o) => o.product.name,
            },
            {
              key: "pricing",
              header: "Pricing",
              render: (o) => (
                <span>
                  <span className="line-through text-muted">{formatPrice(o.normalPrice)}</span>
                  {" → "}
                  <span className="text-lavender">{formatPrice(o.salePrice)}</span>
                  {" "}
                  <span className="text-xs text-muted">(-{o.discount}%)</span>
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (o) => <Badge variant={statusVariant[o.status] ?? "default"}>{o.status}</Badge>,
            },
            {
              key: "dates",
              header: "Period",
              render: (o) => (
                <span className="text-xs text-muted">
                  {format(new Date(o.startAt), "MMM d")} — {format(new Date(o.endAt), "MMM d, yyyy")}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              render: (o) => (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(o)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDuplicate(o)} title="Duplicate"><Copy className="h-4 w-4" /></Button>
                  {o.enabled && (
                    <Button variant="ghost" size="sm" onClick={() => handleDisable(o)} title="Disable"><Ban className="h-4 w-4 text-amber-400" /></Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(o.id)} title="Delete"><Trash2 className="h-4 w-4 text-red-400" /></Button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
