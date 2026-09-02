"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/admin/DataTable";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  priority: number;
  isActive: boolean;
}

const emptyForm = {
  title: "",
  subtitle: "",
  image: "",
  ctaText: "",
  ctaLink: "",
  priority: "0",
  startAt: "",
  endAt: "",
  isActive: true,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchBanners() {
    const res = await fetch("/api/admin/banners");
    setBanners(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchBanners(); }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const body = { ...form, id: editingId, priority: parseInt(form.priority, 10) };

    await fetch("/api/admin/banners", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    resetForm();
    fetchBanners();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" });
    fetchBanners();
  }

  function startEdit(banner: Banner) {
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      image: banner.image ?? "",
      ctaText: banner.ctaText ?? "",
      ctaLink: banner.ctaLink ?? "",
      priority: String(banner.priority),
      startAt: "",
      endAt: "",
      isActive: banner.isActive,
    });
    setEditingId(banner.id);
    setShowForm(true);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Banners</h1>
          <p className="text-sm text-muted">Manage homepage and promotional banners</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-[var(--card-radius)] border border-border bg-surface p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit" : "New"} Banner</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <Input label="Priority" type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
            <Input label="CTA Text" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
            <Input label="CTA Link" value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} />
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
          data={banners}
          keyExtractor={(b) => b.id}
          columns={[
            {
              key: "title",
              header: "Banner",
              render: (b) => (
                <div className="flex items-center gap-3">
                  {b.image && <img src={b.image} alt="" className="h-10 w-16 rounded object-cover" />}
                  <div>
                    <p className="font-medium">{b.title}</p>
                    {b.subtitle && <p className="text-xs text-muted">{b.subtitle}</p>}
                  </div>
                </div>
              ),
            },
            { key: "priority", header: "Priority" },
            {
              key: "cta",
              header: "CTA",
              render: (b) => b.ctaText ?? "—",
            },
            {
              key: "isActive",
              header: "Status",
              render: (b) => <Badge variant={b.isActive ? "live" : "default"}>{b.isActive ? "Active" : "Inactive"}</Badge>,
            },
            {
              key: "actions",
              header: "Actions",
              render: (b) => (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(b)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(b.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
