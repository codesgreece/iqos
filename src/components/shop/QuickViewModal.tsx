"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cn, formatPrice } from "@/lib/utils";

interface QuickViewProduct {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  effectivePrice: number;
  compareAtPrice: number | null;
  onSale: boolean;
  discount: number;
  thumbnail: string | null;
  images: { url: string; alt: string | null }[];
  isLimited: boolean;
  isRare: boolean;
  isNew: boolean;
  stock: number;
  status: string;
  shortDescription: string | null;
  activeOffer: {
    endAt: string | Date;
    badge: string | null;
  } | null;
  variants: { id: string; name: string; stock: number; price: number | null }[];
}

interface QuickViewModalProps {
  slug: string | null;
  onClose: () => void;
}

export function QuickViewModal({ slug, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { success } = useToast();
  const [product, setProduct] = useState<QuickViewProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [variantId, setVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        const p = data.data ?? data;
        setProduct(p);
        setVariantId(p.variants?.[0]?.id ?? null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [slug, onClose]);

  if (!slug) return null;

  const image = product?.thumbnail ?? product?.images?.[0]?.url;
  const outOfStock = !product || product.stock <= 0 || product.status === "OUT_OF_STOCK";

  async function handleAddToCart() {
    if (!product || outOfStock) return;
    setAdding(true);
    try {
      await addItem(product.id, 1, variantId);
      success("Added to cart");
      onClose();
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick view"
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[var(--card-radius)] border border-border bg-surface animate-fade-in"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-border bg-background/80 p-2 text-muted backdrop-blur-sm hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 skeleton rounded-full" />
          </div>
        )}

        {!loading && product && (
          <div className="grid sm:grid-cols-2">
            <div className="relative aspect-square bg-background">
              {image ? (
                <Image src={image} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">No image</div>
              )}
            </div>
            <div className="flex flex-col p-6">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {product.isLimited && <Badge variant="limited">Limited</Badge>}
                {product.isRare && <Badge variant="rare">Rare</Badge>}
                {product.isNew && <Badge variant="new">New</Badge>}
                {product.activeOffer && <Badge variant="live">Live Offer</Badge>}
              </div>
              {product.brand && (
                <p className="text-xs uppercase tracking-widest text-muted">{product.brand}</p>
              )}
              <h2 className="mt-1 text-lg font-bold text-white">{product.name}</h2>
              {product.shortDescription && (
                <p className="mt-2 text-sm text-muted line-clamp-3">{product.shortDescription}</p>
              )}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-xl font-bold text-lavender">
                  {formatPrice(product.effectivePrice)}
                </span>
                {product.onSale && product.compareAtPrice && (
                  <span className="text-sm text-muted line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <Badge variant="sale">-{product.discount}%</Badge>
                )}
              </div>
              {product.activeOffer && (
                <div className="mt-4">
                  <CountdownTimer endAt={product.activeOffer.endAt} size="sm" />
                </div>
              )}
              {product.variants.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
                    Variant
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVariantId(v.id)}
                        className={cn(
                          "rounded-[var(--button-radius)] border px-3 py-1.5 text-sm transition-colors",
                          variantId === v.id
                            ? "border-violet bg-violet/20 text-lavender"
                            : "border-border text-muted hover:border-border-hover"
                        )}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-auto flex flex-col gap-2 pt-6">
                <Button
                  variant="primary"
                  loading={adding}
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  className="w-full"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {outOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-center text-sm text-lavender hover:underline"
                >
                  View full details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
