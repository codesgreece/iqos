import Link from "next/link";
import { getProducts, toProductCardData } from "@/lib/services/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/Button";

export async function FeaturedProducts() {
  const { products } = await getProducts({ limit: 8 });
  const featured = products.filter((p) => p.isFeatured);
  const display = featured.length > 0 ? featured : products.slice(0, 4);

  if (display.length === 0) return null;

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center md:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
            Curated
          </span>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
            Featured Products
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted">
            Hand-picked drops from our latest collection — collector-grade pieces worth the hunt.
          </p>
        </div>

        <ProductGrid products={display.map(toProductCardData)} />

        <div className="mt-10 text-center">
          <Link href="/shop?sort=featured">
            <Button variant="outline">View All Featured</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
