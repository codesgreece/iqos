import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProducts, toProductCardData } from "@/lib/services/products";
import { ProductGrid } from "@/components/shop/ProductGrid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | FINAL BOSS ACTIVITY`,
    description: category.description ?? `Browse ${category.name} at FINAL BOSS ACTIVITY.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const category = await prisma.category.findUnique({ where: { slug, isActive: true } });
  if (!category) notFound();

  const { products, pagination } = await getProducts({
    category: slug,
    page,
    limit: 12,
    sort: "newest",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-muted">{pagination.total} products</p>
      </div>

      <ProductGrid products={products.map(toProductCardData)} />

      {pagination.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/category/${slug}?page=${p}`}
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
