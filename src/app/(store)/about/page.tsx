import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description: "About SMOKA — rare and limited-edition products for collectors.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">About</span>
      <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">SMOKA</h1>
      <p className="mt-2 text-lg text-lavender">Rare • Limited • Exclusive</p>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted">
        <p>
          SMOKA is a premium collector store built for those who seek something
          extraordinary. We source rare, limited-edition technology and accessories that you
          won&apos;t find on every shelf.
        </p>
        <p>
          Every product in our catalog is chosen with intention — limited drops, exclusive finishes,
          and items that hold real value for collectors who appreciate craftsmanship and scarcity.
        </p>
        <h2 className="text-lg font-semibold text-white">Our Philosophy</h2>
        <p>
          We believe the product is the hero. No generic templates, no dropshipping aesthetic.
          Just premium curation, honest presentation, and a shopping experience worthy of the
          items we sell.
        </p>
      </div>

      <div className="mt-10 flex gap-4">
        <Link href="/shop">
          <Button variant="primary">Shop Now</Button>
        </Link>
        <Link href="/limited-editions">
          <Button variant="outline">Limited Editions</Button>
        </Link>
      </div>
    </div>
  );
}
