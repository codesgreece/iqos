import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getProducts, toProductCardData } from "@/lib/services/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Filters } from "@/components/shop/Filters";
import { SortSelect, mapSortToFilters } from "@/components/shop/SortSelect";
import { ShopContent } from "./ShopContent";

export const metadata: Metadata = {
  title: "Shop | FINAL BOSS ACTIVITY",
  description: "Browse rare and limited-edition products at FINAL BOSS ACTIVITY.",
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const sort = (params.sort as string) ?? "featured";
  const page = Number(params.page) || 1;
  const search = params.q as string | undefined;
  const category = params.category as string | undefined;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const brand = params.brand as string | undefined;
  const availability = params.availability as "in_stock" | "out_of_stock" | undefined;
  const isLimited = params.limited === "true" ? true : undefined;
  const isRare = params.rare === "true" ? true : undefined;
  const onSale = params.sale === "true" ? true : undefined;

  const sortFilters = mapSortToFilters(sort);

  const { products, pagination } = await getProducts({
    search,
    category,
    minPrice,
    maxPrice,
    brand,
    availability,
    isLimited: isLimited ?? sortFilters.isLimited,
    isFeatured: sortFilters.isFeatured,
    isRare,
    onSale,
    sort: sortFilters.sort,
    page,
    limit: 12,
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { status: "ACTIVE" } } } } },
  });

  const brands = await prisma.product.findMany({
    where: { status: "ACTIVE", brand: { not: null } },
    select: { brand: true },
    distinct: ["brand"],
  });

  const categoryData = categories.map(({ _count, ...cat }) => ({
    ...cat,
    productCount: _count.products,
  }));

  const brandList = brands
    .map((b) => b.brand)
    .filter((b): b is string => b != null)
    .sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          Shop
        </h1>
        <p className="mt-2 text-sm text-muted">
          {pagination.total} products found
        </p>
      </div>

      <Suspense>
        <ShopContent
          categories={categoryData}
          brands={brandList}
          products={products.map(toProductCardData)}
          pagination={pagination}
        />
      </Suspense>
    </div>
  );
}
