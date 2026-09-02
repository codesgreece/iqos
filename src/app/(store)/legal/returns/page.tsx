import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchanges | SMOKA",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
        Returns &amp; Exchanges
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-muted [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-lavender [&_h2]:mt-8 [&_h2]:mb-3">
        <h2>Return Policy</h2>
        <p>
          You may return unused items in their original packaging within 14 days of delivery for a full
          refund. Limited edition items may only be returned if defective or damaged.
        </p>
        <h2>How to Return</h2>
        <p>
          Contact us at contact@smoka.com with your order number to initiate a return.
          We will provide return instructions and a return authorization.
        </p>
        <h2>Refunds</h2>
        <p>
          Refunds are processed within 5–10 business days after we receive and inspect the returned item.
          Original shipping costs are non-refundable unless the return is due to our error.
        </p>
        <h2>Damaged Items</h2>
        <p>
          If you receive a damaged item, contact us within 48 hours with photos. We will arrange a
          replacement or full refund at no additional cost.
        </p>
      </div>
    </div>
  );
}
