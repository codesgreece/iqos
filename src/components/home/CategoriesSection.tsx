import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function CategoriesSection() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
    include: {
      _count: { select: { products: { where: { status: "ACTIVE" } } } },
    },
  });

  if (categories.length === 0) return null;

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center md:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
            Browse
          </span>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
            Categories
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted">
            Find your next obsession across our curated categories.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-[var(--card-radius)] border border-border bg-surface card-hover"
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
                    <span className="text-2xl font-bold uppercase tracking-widest text-violet/40">
                      {category.name.slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-lg font-semibold text-white group-hover:text-lavender transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted mt-1">
                  {category._count.products} products
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/categories"
            className="text-sm font-medium text-lavender transition-colors hover:text-white"
          >
            View all categories &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
