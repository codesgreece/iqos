"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/admin/DataTable";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

interface CustomerDetail {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  totalSpent: number;
  _count: { orders: number };
  addresses: Array<{
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    items: Array<{ name: string; quantity: number; total: number }>;
  }>;
}

export default function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string>("");

  useEffect(() => {
    params.then(({ id }) => {
      setCustomerId(id);
      fetch(`/api/admin/customers/${id}`)
        .then((r) => r.json())
        .then((data) => setCustomer(data.data ?? data))
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return <div className="h-64 skeleton rounded-[var(--card-radius)]" />;
  }

  if (!customer) {
    return <p className="text-muted">Customer not found</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBreadcrumbs
        items={[
          { label: "Customers", href: "/admin/customers" },
          { label: customer.name ?? customer.email },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{customer.name ?? "Customer"}</h1>
          <p className="text-sm text-muted">{customer.email}</p>
        </div>
        <Badge variant={customer.status === "ACTIVE" ? "new" : "default"}>
          {customer.status}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--card-radius)] border border-border bg-surface p-4">
          <p className="text-xs text-muted">Total Orders</p>
          <p className="text-2xl font-bold text-white">{customer._count.orders}</p>
        </div>
        <div className="rounded-[var(--card-radius)] border border-border bg-surface p-4">
          <p className="text-xs text-muted">Total Spent</p>
          <p className="text-2xl font-bold text-lavender">{formatPrice(customer.totalSpent)}</p>
        </div>
        <div className="rounded-[var(--card-radius)] border border-border bg-surface p-4">
          <p className="text-xs text-muted">Member Since</p>
          <p className="text-lg font-semibold text-white">
            {format(new Date(customer.createdAt), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      {customer.phone && (
        <p className="text-sm text-muted">Phone: {customer.phone}</p>
      )}

      {customer.addresses.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Addresses</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {customer.addresses.map((addr) => (
              <div
                key={addr.id}
                className="rounded-[var(--card-radius)] border border-border bg-surface p-4 text-sm"
              >
                <p className="font-medium text-white">
                  {addr.firstName} {addr.lastName}
                  {addr.isDefault && (
                    <span className="ml-2 text-xs text-lavender">Default</span>
                  )}
                </p>
                <p className="mt-1 text-muted">{addr.address}</p>
                <p className="text-muted">
                  {addr.city}, {addr.postalCode}, {addr.country}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Order History</h2>
        <DataTable
          data={customer.orders}
          keyExtractor={(o) => o.id}
          emptyMessage="No orders yet"
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
              key: "total",
              header: "Total",
              render: (o) => formatPrice(o.total),
            },
            {
              key: "status",
              header: "Status",
              render: (o) => <Badge variant="default">{o.status}</Badge>,
            },
            {
              key: "paymentStatus",
              header: "Payment",
              render: (o) => o.paymentStatus,
            },
            {
              key: "createdAt",
              header: "Date",
              render: (o) => format(new Date(o.createdAt), "MMM d, yyyy"),
            },
          ]}
        />
      </div>
    </div>
  );
}
