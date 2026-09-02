"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string;
  salePrice: string;
  stock: string;
  lowStockThreshold: string;
  status: string;
  isLimited: boolean;
  isRare: boolean;
  isFeatured: boolean;
  isNew: boolean;
  tags: string;
  specifications: string;
  seoTitle: string;
  seoDescription: string;
  thumbnail: string;
  images: { url: string; alt: string }[];
  variants: { name: string; sku: string; price: string; stock: string }[];
}

const defaultData: ProductFormData = {
  name: "",
  slug: "",
  sku: "",
  brand: "",
  categoryId: "",
  description: "",
  shortDescription: "",
  price: "",
  compareAtPrice: "",
  salePrice: "",
  stock: "0",
  lowStockThreshold: "5",
  status: "DRAFT",
  isLimited: false,
  isRare: false,
  isFeatured: false,
  isNew: false,
  tags: "",
  specifications: "{}",
  seoTitle: "",
  seoDescription: "",
  thumbnail: "",
  images: [],
  variants: [],
};

const sections = [
  "General",
  "Pricing",
  "Inventory",
  "Images",
  "Categories",
  "Badges",
  "Variants",
  "Specifications",
  "SEO",
] as const;

interface ProductFormProps {
  productId?: string;
  initialData?: Partial<ProductFormData>;
}

export function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({ ...defaultData, ...initialData });
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]>("General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  function update(field: keyof ProductFormData, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !productId) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function addImage() {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { url: "", alt: "" }],
    }));
  }

  function updateImage(index: number, field: "url" | "alt", value: string) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? { ...img, [field]: value } : img)),
    }));
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function addVariant() {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", sku: "", price: "", stock: "0" }],
    }));
  }

  function updateVariant(index: number, field: keyof ProductFormData["variants"][0], value: string) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }));
  }

  function removeVariant(index: number) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let specs = {};
    try {
      specs = JSON.parse(form.specifications || "{}");
    } catch {
      setError("Invalid JSON in specifications");
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      specifications: specs,
      images: form.images.filter((img) => img.url),
      variants: form.variants
        .filter((v) => v.name && v.sku)
        .map((v) => ({
          name: v.name,
          sku: v.sku,
          price: v.price ? parseFloat(v.price) : null,
          stock: parseInt(v.stock || "0", 10),
        })),
      categoryId: form.categoryId || null,
    };

    const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = productId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Failed to save product");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-[var(--button-radius)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => setActiveSection(section)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeSection === section
                ? "bg-amethyst/30 text-lavender border border-violet/20"
                : "text-muted hover:text-white hover:bg-surface"
            )}
          >
            {section}
          </button>
        ))}
      </div>

      <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
        {activeSection === "General" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            <Input label="Slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
            <Input label="SKU" value={form.sku} onChange={(e) => update("sku", e.target.value)} required />
            <Input label="Brand" value={form.brand} onChange={(e) => update("brand", e.target.value)} />
            <div className="sm:col-span-2">
              <Input label="Short Description" value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-muted mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={5}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-[var(--button-radius)] text-white placeholder:text-muted/60 focus:outline-none focus:border-lavender/50"
              />
            </div>
          </div>
        )}

        {activeSection === "Pricing" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Price" type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} required />
            <Input label="Compare at Price" type="number" step="0.01" value={form.compareAtPrice} onChange={(e) => update("compareAtPrice", e.target.value)} />
            <Input label="Sale Price" type="number" step="0.01" value={form.salePrice} onChange={(e) => update("salePrice", e.target.value)} />
          </div>
        )}

        {activeSection === "Inventory" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} />
            <Input label="Low Stock Threshold" type="number" value={form.lowStockThreshold} onChange={(e) => update("lowStockThreshold", e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full rounded-[var(--button-radius)] border border-border bg-background px-4 py-2.5 text-sm text-white"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        )}

        {activeSection === "Images" && (
          <div className="space-y-4">
            <div>
              <Input label="Thumbnail URL" value={form.thumbnail} onChange={(e) => update("thumbnail", e.target.value)} />
              <ImageUpload value={form.thumbnail} onChange={(url) => update("thumbnail", url)} label="Upload Thumbnail" className="mt-2" />
            </div>
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-3">
                <Input placeholder="Image URL" value={img.url} onChange={(e) => updateImage(i, "url", e.target.value)} />
                <Input placeholder="Alt text" value={img.alt} onChange={(e) => updateImage(i, "alt", e.target.value)} />
                <Button type="button" variant="ghost" onClick={() => removeImage(i)}>Remove</Button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addImage}>Add Image</Button>
          </div>
        )}

        {activeSection === "Categories" && (
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="w-full max-w-md rounded-[var(--button-radius)] border border-border bg-background px-4 py-2.5 text-sm text-white"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        )}

        {activeSection === "Badges" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {(["isLimited", "isRare", "isFeatured", "isNew"] as const).map((field) => (
              <label key={field} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[field]}
                  onChange={(e) => update(field, e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-background accent-violet"
                />
                <span className="text-sm text-white capitalize">{field.replace("is", "")}</span>
              </label>
            ))}
            <div className="sm:col-span-2">
              <Input label="Tags (comma-separated)" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
            </div>
          </div>
        )}

        {activeSection === "Variants" && (
          <div className="space-y-4">
            {form.variants.map((variant, i) => (
              <div key={i} className="grid gap-3 rounded-[var(--button-radius)] border border-border p-4 sm:grid-cols-4">
                <Input placeholder="Name" value={variant.name} onChange={(e) => updateVariant(i, "name", e.target.value)} />
                <Input placeholder="SKU" value={variant.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} />
                <Input placeholder="Price" type="number" step="0.01" value={variant.price} onChange={(e) => updateVariant(i, "price", e.target.value)} />
                <div className="flex gap-2">
                  <Input placeholder="Stock" type="number" value={variant.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} />
                  <Button type="button" variant="ghost" onClick={() => removeVariant(i)}>Remove</Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addVariant}>Add Variant</Button>
          </div>
        )}

        {activeSection === "Specifications" && (
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Specifications (JSON)</label>
            <textarea
              value={form.specifications}
              onChange={(e) => update("specifications", e.target.value)}
              rows={8}
              className="w-full font-mono text-sm px-4 py-2.5 bg-background border border-border rounded-[var(--button-radius)] text-white focus:outline-none focus:border-lavender/50"
              placeholder='{"material": "Premium", "weight": "250g"}'
            />
          </div>
        )}

        {activeSection === "SEO" && (
          <div className="grid gap-4">
            <Input label="SEO Title" value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">SEO Description</label>
              <textarea
                value={form.seoDescription}
                onChange={(e) => update("seoDescription", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-[var(--button-radius)] text-white focus:outline-none focus:border-lavender/50"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {productId ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
