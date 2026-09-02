"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

const checkoutSchema = z.object({
  email: z.string().email("Valid email required"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  phone: z.string().optional(),
  shippingAddress: z.string().min(1, "Address required"),
  shippingCity: z.string().min(1, "City required"),
  shippingPostal: z.string().min(1, "Postal code required"),
  shippingCountry: z.string().length(2).default("GR"),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, isLoading } = useCart();
  const { error: toastError } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");
  const [stripeEnabled, setStripeEnabled] = useState(false);

  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      toastError("Payment was cancelled");
    }
  }, [searchParams, toastError]);

  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((data) => {
        const s = data.data ?? data;
        if (s.payments?.stripeEnabled) setStripeEnabled(true);
        if (s.payments?.codEnabled === false && s.payments?.stripeEnabled) {
          setPaymentMethod("stripe");
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: (formData.get("phone") as string) || undefined,
      shippingAddress: formData.get("shippingAddress") as string,
      shippingCity: formData.get("shippingCity") as string,
      shippingPostal: formData.get("shippingPostal") as string,
      shippingCountry: (formData.get("shippingCountry") as string) || "GR",
      couponCode: (formData.get("couponCode") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    };

    const result = checkoutSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = paymentMethod === "stripe" ? "/api/checkout/stripe" : "/api/checkout";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const json = await res.json();
      const payload = json.data ?? json;

      if (!res.ok) {
        setFormError(payload.error ?? json.error ?? "Checkout failed");
        return;
      }

      if (paymentMethod === "stripe" && payload.url) {
        window.location.href = payload.url;
        return;
      }

      router.push(`/checkout/success?order=${payload.orderNumber}`);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-center text-muted">Loading...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted mb-4">Your cart is empty</p>
        <Link href="/shop">
          <Button variant="primary">Browse Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
        Checkout
      </h1>

      <div className="grid gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
          <section className="rounded-[var(--card-radius)] border border-border bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-lavender">
              Contact Information
            </h2>
            <Input name="email" label="Email" type="email" required error={errors.email} />
            <Input name="phone" label="Phone" type="tel" error={errors.phone} />
          </section>

          <section className="rounded-[var(--card-radius)] border border-border bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-lavender">
              Shipping Address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="firstName" label="First Name" required error={errors.firstName} />
              <Input name="lastName" label="Last Name" required error={errors.lastName} />
            </div>
            <Input name="shippingAddress" label="Address" required error={errors.shippingAddress} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="shippingCity" label="City" required error={errors.shippingCity} />
              <Input name="shippingPostal" label="Postal Code" required error={errors.shippingPostal} />
            </div>
            <Input name="shippingCountry" label="Country Code" defaultValue="GR" error={errors.shippingCountry} />
          </section>

          <section className="rounded-[var(--card-radius)] border border-border bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-lavender">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-[var(--button-radius)] border border-border p-4 transition-colors hover:border-border-hover">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-violet"
                />
                <div>
                  <p className="text-sm font-medium text-white">Cash on Delivery</p>
                  <p className="text-xs text-muted">Pay when your order arrives</p>
                </div>
              </label>
              {stripeEnabled && (
                <label className="flex cursor-pointer items-center gap-3 rounded-[var(--button-radius)] border border-border p-4 transition-colors hover:border-border-hover">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="accent-violet"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">Credit / Debit Card</p>
                    <p className="text-xs text-muted">Secure payment via Stripe</p>
                  </div>
                </label>
              )}
            </div>
            <p className="text-xs text-muted">
              Payment details are processed securely. We never store card information.
            </p>
          </section>

          <section className="rounded-[var(--card-radius)] border border-border bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-lavender">
              Additional
            </h2>
            <Input name="couponCode" label="Coupon Code" error={errors.couponCode} />
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Order Notes</label>
              <textarea
                name="notes"
                rows={3}
                className="w-full rounded-[var(--button-radius)] border border-border bg-background px-4 py-2.5 text-white placeholder:text-muted/60 focus:outline-none focus:border-lavender/50"
                placeholder="Special instructions..."
              />
            </div>
          </section>

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full purple-glow">
            {paymentMethod === "stripe" ? "Pay with Card" : "Place Order"} — {formatPrice(cart.subtotal)}
          </Button>
        </form>

        <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6 h-fit">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-lavender">
            Order Summary
          </h2>
          <ul className="space-y-3 text-sm">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span className="text-muted line-clamp-1">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="text-white shrink-0">{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
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
            <span className="font-bold text-lavender">{formatPrice(cart.subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
