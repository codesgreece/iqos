"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/admin/DataTable";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
}

const emptyForm = { name: "", slug: "", description: "", sortOrder: "0", isActive: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    setCategories(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchCategories(); }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, id: editingId, sortOrder: parseInt(form.sortOrder, 10) } : { ...form, sortOrder: parseInt(form.sortOrder, 10) };

    await fetch("/api/admin/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    resetForm();
    fetchCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    fetchCategories();
  }

  function startEdit(cat: Category) {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      sortOrder: String(cat.sortOrder),
      isActive: cat.isActive,
    });
    setEditingId(cat.id);
    setShowForm(true);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-muted">Organize your product catalog</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-[var(--card-radius)] border border-border bg-surface p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit" : "New"} Category</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            <label className="flex items-center gap-3 self-end pb-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-violet" />
              <span className="text-sm text-white">Active</span>
            </label>
            <div className="sm:col-span-2">
              <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
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
          data={categories}
          keyExtractor={(c) => c.id}
          columns={[
            { key: "name", header: "Name" },
            { key: "slug", header: "Slug" },
            { key: "sortOrder", header: "Order" },
            {
              key: "products",
              header: "Products",
              render: (c) => c._count.products,
            },
            {
              key: "isActive",
              header: "Status",
              render: (c) => <Badge variant={c.isActive ? "live" : "default"}>{c.isActive ? "Active" : "Inactive"}</Badge>,
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
