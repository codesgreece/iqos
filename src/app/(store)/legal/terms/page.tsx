import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SMOKA",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>Last updated: September 2026</p>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using SMOKA (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;),
        you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
      </p>
      <h2>2. Products &amp; Availability</h2>
      <p>
        All products are subject to availability. Limited edition items are sold on a first-come,
        first-served basis. We reserve the right to limit quantities and refuse orders.
      </p>
      <h2>3. Pricing</h2>
      <p>
        Prices are displayed in EUR and include applicable taxes where required. We reserve the right
        to change prices without notice.
      </p>
      <h2>4. Orders &amp; Payment</h2>
      <p>
        By placing an order, you offer to purchase products subject to these terms. Payment must be
        received in full before orders are processed.
      </p>
      <h2>5. Age Verification</h2>
      <p>
        You must be at least 18 years old to purchase from SMOKA. Age verification may
        be required for certain products.
      </p>
      <h2>6. Contact</h2>
      <p>
        For questions about these terms, contact us at contact@smoka.com.
      </p>
    </LegalLayout>
  );
}

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
        {title}
      </h1>
      <div className="prose prose-invert max-w-none space-y-4 text-sm leading-relaxed text-muted [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-lavender [&_h2]:mt-8 [&_h2]:mb-3">
        {children}
      </div>
    </div>
  );
}
