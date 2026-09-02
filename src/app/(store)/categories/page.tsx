import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Categories | SMOKA",
  description: "Browse all product categories at SMOKA.",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { status: "ACTIVE" } } } } },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          All Categories
        </h1>
        <p className="mt-2 text-sm text-muted">
          Explore our curated collection across every category.
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-sm text-muted">No categories yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group overflow-hidden rounded-[var(--card-radius)] border border-border bg-surface card-hover"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-amethyst/20">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="image-zoom object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-3xl font-bold uppercase tracking-widest text-violet/40">
                      {category.name.slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-white group-hover:text-lavender transition-colors">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-1 text-sm text-muted line-clamp-2">
                    {category.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted">
                  {category._count.products} products
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
