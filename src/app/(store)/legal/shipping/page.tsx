import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery | FINAL BOSS ACTIVITY",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
        Shipping &amp; Delivery
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-muted [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-lavender [&_h2]:mt-8 [&_h2]:mb-3">
        <h2>Delivery Times</h2>
        <p>
          Orders are typically processed within 1–2 business days. Standard delivery within Greece takes
          2–5 business days. International delivery times vary by destination.
        </p>
        <h2>Shipping Costs</h2>
        <p>
          Standard shipping is €5.99. Free shipping on orders over €100. Shipping costs are calculated
          at checkout based on your location and order value.
        </p>
        <h2>Order Tracking</h2>
        <p>
          Once your order ships, you will receive a confirmation email with tracking information when available.
        </p>
        <h2>Packaging</h2>
        <p>
          All collector items are carefully packaged to ensure they arrive in perfect condition.
        </p>
      </div>
    </div>
  );
}
