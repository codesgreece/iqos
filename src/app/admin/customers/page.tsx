"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/admin/DataTable";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Pagination, paginateArray } from "@/components/admin/Pagination";
import { format } from "date-fns";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  _count: { orders: number };
}

const PER_PAGE = 15;

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchCustomers = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/customers?${params}`);
    setCustomers(await res.json());
    setLoading(false);
    setPage(1);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const paginated = paginateArray(customers, page, PER_PAGE);

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: "Customers" }]} />

      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-sm text-muted">View registered customers</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="h-64 skeleton rounded-[var(--card-radius)]" />
      ) : (
        <>
          <DataTable
            data={paginated.items}
            keyExtractor={(c) => c.id}
            emptyMessage="No customers found"
            columns={[
              {
                key: "name",
                header: "Name",
                render: (c) => (
                  <Link href={`/admin/customers/${c.id}`} className="text-lavender hover:underline">
                    {c.name ?? "—"}
                  </Link>
                ),
              },
              { key: "email", header: "Email" },
              {
                key: "phone",
                header: "Phone",
                render: (c) => c.phone ?? "—",
              },
              {
                key: "orders",
                header: "Orders",
                render: (c) => c._count.orders,
              },
              {
                key: "status",
                header: "Status",
                render: (c) => (
                  <Badge variant={c.status === "ACTIVE" ? "live" : "default"}>{c.status}</Badge>
                ),
              },
              {
                key: "createdAt",
                header: "Joined",
                render: (c) => format(new Date(c.createdAt), "MMM d, yyyy"),
              },
            ]}
          />
          <Pagination
            page={page}
            totalPages={paginated.totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
}
