"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Filters } from "@/components/shop/Filters";
import { SortSelect } from "@/components/shop/SortSelect";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { Button } from "@/components/ui/Button";
import type { ProductCardData } from "@/components/shop/ProductCard";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

interface ShopContentProps {
  categories: Category[];
  brands: string[];
  products: ProductCardData[];
  pagination: { page: number; totalPages: number; total: number };
}

export function ShopContent({
  categories,
  brands,
  products,
  pagination,
}: ShopContentProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="flex gap-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <Filters categories={categories} brands={brands} />
      </aside>

      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <SortSelect />
        </div>

        <ProductGrid products={products} />

        {pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/shop?page=${p}`}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  p === pagination.page
                    ? "bg-violet text-white"
                    : "text-muted hover:text-white hover:bg-surface"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
