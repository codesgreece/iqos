"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";
import type { LiveOfferWithProduct } from "@/lib/live-offers";

export function LiveOffersSection() {
  const [offers, setOffers] = useState<LiveOfferWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchOffers() {
      try {
        const res = await fetch("/api/live-offers");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) {
          setOffers(Array.isArray(data) ? data : data.offers ?? []);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOffers();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader />
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    );
  }

  if (error || offers.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet/5 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer) => {
            const title = offer.customTitle ?? offer.product.name;
            const image =
              offer.product.thumbnail ??
              offer.product.images?.[0]?.url ??
              null;

            return (
              <Link
                key={offer.id}
                href={`/product/${offer.product.slug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--card-radius)] border border-border bg-background card-hover"
              >
                <div className="relative aspect-square overflow-hidden">
                  {image ? (
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="image-zoom object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-amethyst/20">
                      <Zap className="h-8 w-8 text-violet/50" />
                    </div>
                  )}

                  <div className="absolute left-3 top-3 flex gap-1.5">
                    <Badge variant="live">Live</Badge>
                    {offer.badge && <Badge variant="sale">{offer.badge}</Badge>}
                    {offer.discount > 0 && (
                      <Badge variant="sale">-{Math.round(offer.discount)}%</Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  {offer.product.brand && (
                    <p className="mb-1 text-xs uppercase tracking-widest text-muted">
                      {offer.product.brand}
                    </p>
                  )}
                  <h3 className="mb-2 line-clamp-2 text-sm font-medium text-white group-hover:text-lavender">
                    {title}
                  </h3>

                  {offer.customDescription && (
                    <p className="mb-3 line-clamp-2 text-xs text-muted">
                      {offer.customDescription}
                    </p>
                  )}

                  <div className="mt-auto flex items-baseline gap-2">
                    <span className="text-base font-semibold text-lavender">
                      {formatPrice(offer.salePrice)}
                    </span>
                    <span className="text-sm text-muted line-through">
                      {formatPrice(offer.normalPrice)}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-border pt-4">
                    <CountdownTimer endAt={offer.endAt} size="sm" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/offers"
            className="text-sm font-medium text-lavender transition-colors hover:text-white"
          >
            View all live offers &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <div className="mb-10 flex flex-col items-center text-center md:mb-14">
      <div className="mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-violet" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
          Live Now
        </span>
      </div>
      <h2 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
        Live Offers
      </h2>
      <p className="mt-3 max-w-md text-sm text-muted">
        Time-limited drops at exclusive prices. Once the countdown hits zero, they&apos;re gone.
      </p>
    </div>
  );
}
