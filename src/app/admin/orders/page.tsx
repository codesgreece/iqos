"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/admin/DataTable";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

interface Order {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  _count: { items: number };
}

const statusVariant: Record<string, "default" | "live" | "sale" | "new"> = {
  PENDING: "default",
  CONFIRMED: "new",
  PROCESSING: "sale",
  SHIPPED: "live",
  DELIVERED: "new",
  CANCELLED: "default",
  REFUNDED: "default",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/orders?${params}`);
    setOrders(await res.json());
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-sm text-muted">Manage customer orders</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-[var(--button-radius)] border border-border bg-background px-4 py-2.5 text-sm text-white"
        >
          <option value="">All Statuses</option>
          {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="h-64 skeleton rounded-[var(--card-radius)]" />
      ) : (
        <DataTable
          data={orders}
          keyExtractor={(o) => o.id}
          onRowClick={(o) => router.push(`/admin/orders/${o.id}`)}
          columns={[
            { key: "orderNumber", header: "Order #" },
            {
              key: "customer",
              header: "Customer",
              render: (o) => `${o.firstName} ${o.lastName}`,
            },
            { key: "email", header: "Email" },
            {
              key: "items",
              header: "Items",
              render: (o) => o._count.items,
            },
            {
              key: "total",
              header: "Total",
              render: (o) => formatPrice(o.total),
            },
            {
              key: "status",
              header: "Status",
              render: (o) => (
                <select
                  value={o.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => { e.stopPropagation(); updateStatus(o.id, e.target.value); }}
                  className="rounded border border-border bg-background px-2 py-1 text-xs text-white"
                >
                  {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ),
            },
            {
              key: "paymentStatus",
              header: "Payment",
              render: (o) => <Badge variant={statusVariant[o.paymentStatus] ?? "default"}>{o.paymentStatus}</Badge>,
            },
            {
              key: "createdAt",
              header: "Date",
              render: (o) => format(new Date(o.createdAt), "MMM d, yyyy"),
            },
          ]}
        />
      )}
    </div>
  );
}
