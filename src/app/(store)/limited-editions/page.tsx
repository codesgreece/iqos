import type { Metadata } from "next";
import { getProducts, toProductCardData } from "@/lib/services/products";
import { ProductGrid } from "@/components/shop/ProductGrid";

export const metadata: Metadata = {
  title: "Limited Editions | FINAL BOSS ACTIVITY",
  description: "Exclusive limited edition products — once they're gone, they're gone.",
};

interface LimitedEditionsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LimitedEditionsPage({ searchParams }: LimitedEditionsPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const { products, pagination } = await getProducts({
    isLimited: true,
    sort: "newest",
    page,
    limit: 12,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-lavender">
          Exclusive
        </span>
        <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          Limited Editions
        </h1>
        <p className="mt-2 max-w-md mx-auto text-sm text-muted">
          Rare drops with limited availability. Collector-grade pieces for those who arrive first.
        </p>
        <p className="mt-2 text-sm text-muted">{pagination.total} products</p>
      </div>

      <ProductGrid products={products.map(toProductCardData)} />

      {pagination.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/limited-editions?page=${p}`}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                p === pagination.page
                  ? "bg-violet text-white"
                  : "text-muted hover:text-white hover:bg-surface"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
