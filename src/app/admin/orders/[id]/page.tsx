"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/admin/DataTable";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

interface OrderDetail {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingPostal: string;
  shippingCountry: string;
  notes: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    total: number;
    product?: { slug: string; thumbnail: string | null };
  }>;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
        setPaymentStatus(data.paymentStatus);
        setNotes(data.notes ?? "");
      });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus, notes }),
    });
    const updated = await res.json();
    setOrder(updated);
    setSaving(false);
  }

  if (!order) {
    return <div className="h-64 skeleton rounded-[var(--card-radius)]" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{order.orderNumber}</h1>
          <p className="text-sm text-muted">
            Placed {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Order Items</h2>
            <DataTable
              data={order.items}
              keyExtractor={(item) => item.id}
              columns={[
                {
                  key: "name",
                  header: "Product",
                  render: (item) => (
                    <div className="flex items-center gap-3">
                      {item.product?.thumbnail && (
                        <img src={item.product.thumbnail} alt="" className="h-10 w-10 rounded object-cover" />
                      )}
                      <span>{item.name}</span>
                    </div>
                  ),
                },
                { key: "sku", header: "SKU" },
                { key: "quantity", header: "Qty" },
                {
                  key: "price",
                  header: "Price",
                  render: (item) => formatPrice(item.price),
                },
                {
                  key: "total",
                  header: "Total",
                  render: (item) => formatPrice(item.total),
                },
              ]}
            />
          </div>

          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Shipping Address</h2>
            <p className="text-white">{order.firstName} {order.lastName}</p>
            <p className="text-muted">{order.shippingAddress}</p>
            <p className="text-muted">{order.shippingCity}, {order.shippingPostal}</p>
            <p className="text-muted">{order.shippingCountry}</p>
            {order.phone && <p className="mt-2 text-muted">{order.phone}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between"><span className="text-muted">Discount</span><span className="text-lavender">-{formatPrice(order.discount)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{formatPrice(order.shipping)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
            {order.couponCode && (
              <p className="text-xs text-muted">Coupon: {order.couponCode}</p>
            )}
          </div>

          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Status</h2>
            <div>
              <label className="block text-sm text-muted mb-1">Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-[var(--button-radius)] border border-border bg-background px-4 py-2.5 text-sm text-white"
              >
                {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full rounded-[var(--button-radius)] border border-border bg-background px-4 py-2.5 text-sm text-white"
              >
                {["PENDING", "PAID", "FAILED", "REFUNDED"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-[var(--button-radius)] text-white text-sm focus:outline-none focus:border-lavender/50"
              />
            </div>
            <Button onClick={handleSave} loading={saving} className="w-full">Save Changes</Button>
          </div>

          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">Customer</h2>
            <p className="text-white">{order.firstName} {order.lastName}</p>
            <p className="text-sm text-muted">{order.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
