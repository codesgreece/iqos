"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Pencil, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/admin/DataTable";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: string;
  category?: { name: string } | null;
  images?: { url: string }[];
}

const statusColors: Record<string, "default" | "live" | "sale" | "new" | "limited"> = {
  DRAFT: "default",
  ACTIVE: "live",
  OUT_OF_STOCK: "sale",
  ARCHIVED: "limited",
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  async function handleDuplicate(product: Product) {
    const res = await fetch(`/api/admin/products/${product.id}`);
    const full = await res.json();
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...full,
        name: `${full.name} (Copy)`,
        slug: `${full.slug}-copy-${Date.now()}`,
        sku: `${full.sku}-COPY-${Date.now()}`,
        status: "DRAFT",
      }),
    });
    fetchProducts();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-muted">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-[var(--button-radius)] border border-border bg-background px-4 py-2.5 text-sm text-white"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="h-64 skeleton rounded-[var(--card-radius)]" />
      ) : (
        <DataTable
          data={products}
          keyExtractor={(p) => p.id}
          columns={[
            {
              key: "name",
              header: "Product",
              render: (p) => (
                <div className="flex items-center gap-3">
                  {p.images?.[0]?.url && (
                    <img src={p.images[0].url} alt="" className="h-10 w-10 rounded object-cover" />
                  )}
                  <span className="font-medium">{p.name}</span>
                </div>
              ),
            },
            { key: "sku", header: "SKU" },
            {
              key: "category",
              header: "Category",
              render: (p) => p.category?.name ?? "—",
            },
            {
              key: "price",
              header: "Price",
              render: (p) => formatPrice(p.price),
            },
            {
              key: "stock",
              header: "Stock",
              render: (p) => (
                <span className={p.stock <= 5 ? "text-amber-400" : ""}>{p.stock}</span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (p) => <Badge variant={statusColors[p.status] ?? "default"}>{p.status}</Badge>,
            },
            {
              key: "actions",
              header: "Actions",
              render: (p) => (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); router.push(`/admin/products/${p.id}`); }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleDuplicate(p); }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
