"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { DataTable } from "@/components/admin/DataTable";
import { SimpleBarChart, SimpleLineChart } from "@/components/admin/SimpleChart";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

interface DashboardData {
  stats: {
    totalSales: number;
    orders: number;
    customers: number;
    products: number;
    lowStock: number;
    activeOffers: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    firstName: string;
    lastName: string;
    total: number;
    status: string;
    createdAt: string;
    user?: { name: string | null; email: string } | null;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    sku: string;
    stock: number;
    lowStockThreshold: number;
  }>;
  charts?: {
    salesByDay: { label: string; value: number }[];
    ordersByDay: { label: string; value: number }[];
    topProducts: { label: string; value: number }[];
    recentCustomers: Array<{ id: string; name: string | null; email: string; createdAt: string }>;
    activeOffers: Array<{ id: string; product: { name: string }; salePrice: number; endAt: string }>;
  };
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

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 skeleton rounded-[var(--card-radius)]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-muted">Failed to load dashboard</p>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-muted">Overview of your store performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Sales" value={formatPrice(data.stats.totalSales)} icon={DollarSign} variant="success" />
        <StatCard title="Orders" value={data.stats.orders} icon={ShoppingCart} />
        <StatCard title="Customers" value={data.stats.customers} icon={Users} />
        <StatCard title="Products" value={data.stats.products} icon={Package} />
        <StatCard title="Low Stock" value={data.stats.lowStock} icon={AlertTriangle} variant="warning" />
        <StatCard title="Active Offers" value={data.stats.activeOffers} icon={Zap} variant="success" />
      </div>

      {data.charts && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6 lg:col-span-2">
            <SimpleLineChart
              title="Revenue (Last 7 Days)"
              data={data.charts.salesByDay}
              formatValue={(v) => formatPrice(v)}
            />
          </div>
          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <SimpleBarChart title="Orders (Last 7 Days)" data={data.charts.ordersByDay} />
          </div>
          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <SimpleBarChart title="Top Products" data={data.charts.topProducts} />
          </div>
          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <h3 className="mb-4 text-sm font-semibold text-white">Active Live Offers</h3>
            {data.charts.activeOffers.length === 0 ? (
              <p className="text-sm text-muted">No active offers</p>
            ) : (
              <ul className="space-y-2">
                {data.charts.activeOffers.map((o) => (
                  <li key={o.id} className="flex justify-between text-sm">
                    <span className="text-muted truncate">{o.product.name}</span>
                    <span className="text-lavender shrink-0">{formatPrice(o.salePrice)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <h3 className="mb-4 text-sm font-semibold text-white">Recent Customers</h3>
            {data.charts.recentCustomers.length === 0 ? (
              <p className="text-sm text-muted">No customers yet</p>
            ) : (
              <ul className="space-y-2">
                {data.charts.recentCustomers.map((c) => (
                  <li key={c.id}>
                    <Link href={`/admin/customers/${c.id}`} className="text-sm text-lavender hover:underline">
                      {c.name ?? c.email}
                    </Link>
                    <p className="text-xs text-muted">{format(new Date(c.createdAt), "MMM d, yyyy")}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-lavender hover:underline">
              View all
            </Link>
          </div>
          <DataTable
            data={data.recentOrders}
            keyExtractor={(o) => o.id}
            columns={[
              {
                key: "orderNumber",
                header: "Order",
                render: (o) => (
                  <Link href={`/admin/orders/${o.id}`} className="text-lavender hover:underline">
                    {o.orderNumber}
                  </Link>
                ),
              },
              {
                key: "customer",
                header: "Customer",
                render: (o) => o.user?.name || `${o.firstName} ${o.lastName}`,
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
                  <Badge variant={statusVariant[o.status] ?? "default"}>{o.status}</Badge>
                ),
              },
              {
                key: "createdAt",
                header: "Date",
                render: (o) => format(new Date(o.createdAt), "MMM d, yyyy"),
              },
            ]}
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Low Stock Alerts</h2>
            <Link href="/admin/inventory?filter=low" className="text-sm text-lavender hover:underline">
              Manage inventory
            </Link>
          </div>
          <DataTable
            data={data.lowStockProducts}
            keyExtractor={(p) => p.id}
            emptyMessage="All products are well stocked"
            columns={[
              {
                key: "name",
                header: "Product",
                render: (p) => (
                  <Link href={`/admin/products/${p.id}`} className="text-lavender hover:underline">
                    {p.name}
                  </Link>
                ),
              },
              { key: "sku", header: "SKU" },
              {
                key: "stock",
                header: "Stock",
                render: (p) => (
                  <span className={p.stock <= 0 ? "text-red-400" : "text-amber-400"}>{p.stock}</span>
                ),
              },
              { key: "lowStockThreshold", header: "Threshold" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
