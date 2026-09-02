"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-muted">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
        Your Cart
      </h1>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted">Your cart is empty</p>
          <Link href="/shop">
            <Button variant="primary">Browse Shop</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-3">
          <ul className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 rounded-[var(--card-radius)] border border-border bg-surface p-4"
              >
                <Link
                  href={`/product/${item.product.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-background"
                >
                  {item.product.thumbnail ? (
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      sizes="96px"
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
                  {item.variant && (
                    <p className="text-xs text-muted mt-0.5">{item.variant.name}</p>
                  )}
                  <p className="mt-1 text-sm font-semibold text-lavender">
                    {formatPrice(item.unitPrice)}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item.id, item.quantity - 1)
                            : removeItem(item.id)
                        }
                        className="p-2 text-muted hover:text-white"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-2 text-muted hover:text-white disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1 text-xs text-muted hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>

                <p className="text-sm font-semibold text-white">
                  {formatPrice(item.lineTotal)}
                </p>
              </li>
            ))}
          </ul>

          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-lavender">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-white">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="text-white">Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-4 flex justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="text-lg font-bold text-lavender">
                {formatPrice(cart.subtotal)}
              </span>
            </div>
            <Link href="/checkout" className="mt-6 block">
              <Button variant="primary" className="w-full purple-glow">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
