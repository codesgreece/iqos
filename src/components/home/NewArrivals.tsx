import Link from "next/link";
import { getProducts, toProductCardData } from "@/lib/services/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/Button";

export async function NewArrivals() {
  const { products } = await getProducts({ sort: "newest", limit: 8 });
  const newProducts = products.filter((p) => p.isNew);
  const display = newProducts.length > 0 ? newProducts : products.slice(0, 4);

  if (display.length === 0) return null;

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center md:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
            Just Dropped
          </span>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
            New Arrivals
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted">
            The latest additions to the FINAL BOSS ACTIVITY collection.
          </p>
        </div>

        <ProductGrid products={display.map(toProductCardData)} />

        <div className="mt-10 text-center">
          <Link href="/shop?sort=newest">
            <Button variant="outline">Shop New Arrivals</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
