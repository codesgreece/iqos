"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QuickViewModal } from "@/components/shop/QuickViewModal";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  compareAtPrice: number | null;
  salePrice: number | null;
  thumbnail: string | null;
  isLimited: boolean;
  isRare: boolean;
  isNew: boolean;
  stock: number;
  status: string;
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { success } = useToast();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);

  const displayPrice = product.salePrice ?? product.price;
  const originalPrice = product.compareAtPrice ?? product.price;
  const onSale = product.salePrice != null && product.salePrice < originalPrice;
  const discount = onSale ? calculateDiscount(originalPrice, product.salePrice!) : 0;
  const outOfStock = product.stock <= 0 || product.status === "OUT_OF_STOCK";

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/wishlist", {
        method: wishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        setWishlisted(!wishlisted);
        success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
      }
    } catch {
      /* ignore */
    }
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    setAdding(true);
    try {
      await addItem(product.id, 1);
      success("Added to cart");
    } finally {
      setAdding(false);
    }
  }

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewSlug(product.slug);
  }

  return (
    <>
      <article
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-[var(--card-radius)] border border-border bg-surface card-hover",
          className
        )}
      >
        <Link href={`/product/${product.slug}`} className="flex flex-1 flex-col">
          <div className="relative aspect-square overflow-hidden bg-background">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="image-zoom object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-amethyst/20">
                <span className="text-xs uppercase tracking-widest text-muted">No image</span>
              </div>
            )}

            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {product.isLimited && <Badge variant="limited">Limited</Badge>}
              {product.isRare && <Badge variant="rare">Rare</Badge>}
              {product.isNew && <Badge variant="new">New</Badge>}
              {onSale && discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
            </div>

            <div className="absolute right-3 top-3 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleWishlist}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(
                  "rounded-full border border-border bg-background/80 p-2 backdrop-blur-sm transition-all",
                  "opacity-0 group-hover:opacity-100 focus:opacity-100",
                  wishlisted ? "text-violet border-violet/40 opacity-100" : "text-muted hover:text-lavender hover:border-border-hover"
                )}
              >
                <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
              </button>
              <button
                type="button"
                onClick={handleQuickView}
                aria-label="Quick view"
                className="rounded-full border border-border bg-background/80 p-2 text-muted backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-lavender hover:border-border-hover"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>

            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                <span className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-4">
            {product.brand && (
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted">
                {product.brand}
              </p>
            )}
            <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-snug text-white transition-colors group-hover:text-lavender">
              {product.name}
            </h3>
            <div className="mt-auto flex items-baseline gap-2">
              <span className="text-base font-semibold text-lavender">
                {formatPrice(displayPrice)}
              </span>
              {onSale && (
                <span className="text-sm text-muted line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </Link>

        <div className="border-t border-border p-4 pt-0">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            disabled={outOfStock}
            loading={adding}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </article>

      <QuickViewModal slug={quickViewSlug} onClose={() => setQuickViewSlug(null)} />
    </>
  );
}
