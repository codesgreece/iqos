import type { Metadata } from "next";
import { getProducts, toProductCardData } from "@/lib/services/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SearchForm } from "./SearchForm";

export const metadata: Metadata = {
  title: "Search | FINAL BOSS ACTIVITY",
};

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const q = (sp.q as string) ?? "";
  const page = Number(sp.page) || 1;

  const { products, pagination } = q
    ? await getProducts({ search: q, page, limit: 12, sort: "newest" })
    : { products: [], pagination: { page: 1, totalPages: 0, total: 0, limit: 12 } };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          Search Results
        </h1>
        {q && (
          <p className="mt-2 text-sm text-muted">
            {pagination.total} results for &ldquo;{q}&rdquo;
          </p>
        )}
      </div>

      <SearchForm initialQuery={q} />

      {q && <ProductGrid products={products.map(toProductCardData)} />}

      {!q && (
        <p className="text-center text-sm text-muted">Enter a search term to find products.</p>
      )}
    </div>
  );
}
