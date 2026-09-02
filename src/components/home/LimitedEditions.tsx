import Link from "next/link";
import { getProducts, toProductCardData } from "@/lib/services/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/Button";

export async function LimitedEditions() {
  const { products } = await getProducts({ isLimited: true, limit: 8 });

  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amethyst/10 via-transparent to-violet/5"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center md:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-lavender">
            Exclusive
          </span>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
            Limited Editions
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted">
            Once they&apos;re gone, they&apos;re gone. Limited runs for those who arrive first.
          </p>
        </div>

        <ProductGrid products={products.map(toProductCardData)} />

        <div className="mt-10 text-center">
          <Link href="/limited-editions">
            <Button variant="primary" className="purple-glow">
              Explore All Limited Editions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
