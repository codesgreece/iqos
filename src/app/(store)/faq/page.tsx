import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about SMOKA.",
};

const FAQ_ITEMS = [
  {
    q: "What makes SMOKA different?",
    a: "We curate rare, limited-edition and collector-grade products. Every drop is selected for exclusivity and quality — not mass-market availability.",
  },
  {
    q: "How do Live Offers work?",
    a: "Live Offers are time-limited promotions managed from our admin panel. Each offer has a start and end time with a live countdown. When the timer expires, the offer is automatically removed.",
  },
  {
    q: "Do you ship internationally?",
    a: "We currently ship within Greece and select EU countries. See our Shipping Policy for delivery times and costs.",
  },
  {
    q: "What is your returns policy?",
    a: "Unopened products in original condition may be returned within 14 days. See our Returns Policy for full details.",
  },
  {
    q: "How can I track my order?",
    a: "Log in to your account and visit Orders to view status and details for every purchase.",
  },
  {
    q: "Are the products authentic?",
    a: "Every product sold through SMOKA is sourced through authorized channels. We guarantee authenticity on all limited-edition items.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">Help</span>
      <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-3 text-sm text-muted">
        Everything you need to know about shopping with SMOKA.
      </p>

      <div className="mt-10 space-y-4">
        {FAQ_ITEMS.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-[var(--card-radius)] border border-border bg-surface"
          >
            <summary className="cursor-pointer list-none px-6 py-4 text-sm font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {q}
                <span className="text-lavender transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <div className="border-t border-border px-6 py-4 text-sm leading-relaxed text-muted">
              {a}
            </div>
          </details>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted">
        Still have questions?{" "}
        <Link href="/contact" className="text-lavender hover:underline">
          Get in touch
        </Link>
        .
      </p>
    </div>
  );
}
