import { cn } from "@/lib/utils";
import { ProductCard, type ProductCardData } from "./ProductCard";

interface ProductGridProps {
  products: ProductCardData[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, className, columns = 4 }: ProductGridProps) {
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[var(--card-radius)] border border-border bg-surface py-16 text-center">
        <p className="text-sm text-muted">No products found.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4 md:gap-6",
        columnClasses[columns],
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
