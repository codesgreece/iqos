"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ShareButton } from "@/components/product/ShareButton";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cn, formatPrice } from "@/lib/utils";
import type { EnrichedProduct } from "@/lib/services/products";

interface ProductInfoProps {
  product: EnrichedProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { success } = useToast();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const stock = selectedVariant?.stock ?? product.stock;
  const outOfStock = stock <= 0 || product.status === "OUT_OF_STOCK";
  const displayPrice =
    selectedVariant?.price ??
  product.effectivePrice;
  const comparePrice = product.compareAtPrice ?? product.price;
  const onSale = product.onSale || displayPrice < comparePrice;

  async function handleAddToCart() {
    setLoading(true);
    try {
      await addItem(product.id, quantity, selectedVariantId);
      success("Added to cart");
    } finally {
      setLoading(false);
    }
  }

  async function handleBuyNow() {
    setLoading(true);
    try {
      await addItem(product.id, quantity, selectedVariantId);
      router.push("/checkout");
    } finally {
      setLoading(false);
    }
  }

  async function handleWishlist() {
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
      setWishlisted(!wishlisted);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {product.isLimited && <Badge variant="limited">Limited</Badge>}
        {product.isRare && <Badge variant="rare">Rare</Badge>}
        {product.isNew && <Badge variant="new">New</Badge>}
        {onSale && product.discount > 0 && (
          <Badge variant="sale">-{product.discount}%</Badge>
        )}
        {product.activeOffer && <Badge variant="live">Live Offer</Badge>}
      </div>

      {product.brand && (
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          {product.brand}
        </p>
      )}

      <h1 className="text-2xl font-bold text-white md:text-3xl">{product.name}</h1>

      {product.shortDescription && (
        <p className="text-sm leading-relaxed text-muted">{product.shortDescription}</p>
      )}

      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-lavender">
          {formatPrice(displayPrice)}
        </span>
        {onSale && (
          <span className="text-lg text-muted line-through">
            {formatPrice(comparePrice)}
          </span>
        )}
      </div>

      {product.activeOffer && (
        <div className="rounded-[var(--card-radius)] border border-violet/30 bg-violet/10 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-violet" />
            <span className="text-sm font-semibold text-lavender">Live Offer Active</span>
          </div>
          <CountdownTimer endAt={product.activeOffer.endAt} size="md" />
        </div>
      )}

      {product.variants.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-muted">Variant</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={variant.stock <= 0}
                className={cn(
                  "rounded-[var(--button-radius)] border px-4 py-2 text-sm transition-colors",
                  selectedVariantId === variant.id
                    ? "border-lavender bg-violet/20 text-lavender"
                    : "border-border text-muted hover:border-border-hover",
                  variant.stock <= 0 && "opacity-40 cursor-not-allowed"
                )}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-muted">Quantity</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="rounded-lg border border-border px-3 py-2 text-muted hover:text-white"
          >
            −
          </button>
          <span className="min-w-[2rem] text-center text-white">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={quantity >= stock}
            className="rounded-lg border border-border px-3 py-2 text-muted hover:text-white disabled:opacity-40"
          >
            +
          </button>
          <span className="text-xs text-muted">
            {outOfStock ? "Out of stock" : `${stock} available`}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          className="flex-1 purple-glow"
          disabled={outOfStock}
          loading={loading}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-5 w-5" />
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={outOfStock}
          loading={loading}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-5 w-5", wishlisted && "fill-lavender text-lavender")} />
        </Button>
        <ShareButton title={product.name} className="sm:ml-auto" />
      </div>

      <p className="text-xs text-muted">SKU: {product.sku}</p>

      {product.category && (
        <p className="text-sm text-muted">
          Category:{" "}
          <Link
            href={`/category/${product.category.slug}`}
            className="text-lavender hover:text-white transition-colors"
          >
            {product.category.name}
          </Link>
        </p>
      )}

      {product.description && (
        <div className="border-t border-border pt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-lavender">
            Description
          </h2>
          <div className="text-sm leading-relaxed text-muted whitespace-pre-line">
            {product.description}
          </div>
        </div>
      )}

      {Object.keys(product.specifications).length > 0 && (
        <div className="border-t border-border pt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-lavender">
            Specifications
          </h2>
          <dl className="space-y-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <dt className="text-muted">{key}</dt>
                <dd className="text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
