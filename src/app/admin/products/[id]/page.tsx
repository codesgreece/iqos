"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { parseTags } from "@/lib/utils";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((product) => {
        setInitialData({
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          brand: product.brand ?? "",
          categoryId: product.categoryId ?? "",
          description: product.description ?? "",
          shortDescription: product.shortDescription ?? "",
          price: String(product.price),
          compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
          salePrice: product.salePrice ? String(product.salePrice) : "",
          stock: String(product.stock),
          lowStockThreshold: String(product.lowStockThreshold),
          status: product.status,
          isLimited: product.isLimited,
          isRare: product.isRare,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          tags: parseTags(product.tags).join(", "),
          specifications: product.specifications ?? "{}",
          seoTitle: product.seoTitle ?? "",
          seoDescription: product.seoDescription ?? "",
          thumbnail: product.thumbnail ?? "",
          images: product.images ?? [],
          variants: (product.variants ?? []).map((v: { name: string; sku: string; price: number | null; stock: number }) => ({
            name: v.name,
            sku: v.sku,
            price: v.price != null ? String(v.price) : "",
            stock: String(v.stock),
          })),
        });
      });
  }, [id]);

  if (!initialData) {
    return <div className="h-64 skeleton rounded-[var(--card-radius)]" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Product</h1>
        <p className="text-sm text-muted">Update product details</p>
      </div>
      <ProductForm productId={id} initialData={initialData as never} />
    </div>
  );
}
