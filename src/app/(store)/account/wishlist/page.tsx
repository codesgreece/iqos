"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string | null;
    price: number;
    salePrice: number | null;
    stock: number;
    status: string;
  };
}

export default function WishlistPage() {
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        const wishlist = data.data ?? data;
        setItems(wishlist.items ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function removeItem(productId: string) {
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading wishlist...</p>;
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-white">
        Wishlist
      </h1>

      {items.length === 0 ? (
        <p className="text-sm text-muted">Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => {
            const price = item.product.salePrice ?? item.product.price;
            const outOfStock = item.product.stock <= 0;

            return (
              <li
                key={item.id}
                className="flex gap-4 rounded-[var(--card-radius)] border border-border bg-surface p-4"
              >
                <Link
                  href={`/product/${item.product.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-background"
                >
                  {item.product.thumbnail ? (
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">
                      No img
                    </div>
                  )}
                </Link>

                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-medium text-white hover:text-lavender"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-lavender">
                    {formatPrice(price)}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={outOfStock}
                      onClick={() => addItem(item.productId)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Heart className="h-4 w-4 fill-lavender text-lavender" />
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
