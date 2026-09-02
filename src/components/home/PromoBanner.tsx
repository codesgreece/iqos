import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";

export async function PromoBanner() {
  const now = new Date();
  const banner = await prisma.banner.findFirst({
    where: {
      isActive: true,
      OR: [
        { startAt: null, endAt: null },
        { startAt: { lte: now }, endAt: { gte: now } },
        { startAt: { lte: now }, endAt: null },
        { startAt: null, endAt: { gte: now } },
      ],
    },
    orderBy: { priority: "desc" },
  });

  const title = banner?.title ?? "Collector Season Is Here";
  const subtitle =
    banner?.subtitle ?? "Free shipping on orders over €100. Limited drops every week.";
  const ctaText = banner?.ctaText ?? "Shop Now";
  const ctaLink = banner?.ctaLink ?? "/shop";

  return (
    <section className="bg-background py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[var(--card-radius)] border border-border bg-gradient-to-r from-amethyst/40 via-violet/30 to-amethyst/40 px-8 py-12 text-center purple-glow"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(216,180,254,0.15),transparent_60%)]"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-lavender/90 md:text-base">
              {subtitle}
            </p>
            <div className="mt-8">
              <Link href={ctaLink}>
                <Button variant="primary" size="lg" className="purple-glow">
                  {ctaText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
