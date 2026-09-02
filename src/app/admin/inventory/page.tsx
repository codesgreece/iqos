"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/admin/DataTable";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: string;
  thumbnail: string | null;
  category?: { name: string } | null;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<Record<string, string>>({});

  const fetchInventory = useCallback(async () => {
    const params = new URLSearchParams();
    if (filter) params.set("filter", filter);
    const res = await fetch(`/api/admin/inventory?${params}`);
    setItems(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  async function saveStock(id: string) {
    const stock = editingStock[id];
    if (stock === undefined) return;

    await fetch("/api/admin/inventory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stock: parseInt(stock, 10) }),
    });

    setEditingStock((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    fetchInventory();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Inventory</h1>
        <p className="text-sm text-muted">Monitor and update stock levels</p>
      </div>

      <div className="flex gap-3">
        {[
          { value: "", label: "All" },
          { value: "low", label: "Low Stock" },
          { value: "out", label: "Out of Stock" },
        ].map(({ value, label }) => (
          <Button
            key={value}
            variant={filter === value ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 skeleton rounded-[var(--card-radius)]" />
      ) : (
        <DataTable
          data={items}
          keyExtractor={(item) => item.id}
          columns={[
            {
              key: "name",
              header: "Product",
              render: (item) => (
                <Link href={`/admin/products/${item.id}`} className="flex items-center gap-3 text-lavender hover:underline">
                  {item.thumbnail && <img src={item.thumbnail} alt="" className="h-8 w-8 rounded object-cover" />}
                  {item.name}
                </Link>
              ),
            },
            { key: "sku", header: "SKU" },
            {
              key: "category",
              header: "Category",
              render: (item) => item.category?.name ?? "—",
            },
            {
              key: "stock",
              header: "Stock",
              render: (item) => {
                const isEditing = editingStock[item.id] !== undefined;
                return isEditing ? (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Input
                      type="number"
                      value={editingStock[item.id]}
                      onChange={(e) => setEditingStock({ ...editingStock, [item.id]: e.target.value })}
                      className="w-20 py-1"
                    />
                    <Button size="sm" onClick={() => saveStock(item.id)}>Save</Button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingStock({ ...editingStock, [item.id]: String(item.stock) });
                    }}
                    className={item.stock <= 0 ? "text-red-400" : item.stock <= item.lowStockThreshold ? "text-amber-400" : "text-white"}
                  >
                    {item.stock}
                  </button>
                );
              },
            },
            { key: "lowStockThreshold", header: "Threshold" },
            {
              key: "status",
              header: "Status",
              render: (item) => {
                if (item.stock <= 0) return <Badge variant="sale">Out of Stock</Badge>;
                if (item.stock <= item.lowStockThreshold) return <Badge variant="limited">Low Stock</Badge>;
                return <Badge variant="live">In Stock</Badge>;
              },
            },
          ]}
        />
      )}
    </div>
  );
}
