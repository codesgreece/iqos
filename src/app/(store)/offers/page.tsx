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

export default function OffersPage() {
  const [offers, setOffers] = useState<LiveOfferWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/live-offers")
      .then((res) => res.json())
      .then((data) => setOffers(Array.isArray(data) ? data : data.data ?? data.offers ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Zap className="h-4 w-4 text-violet" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
            Live Now
          </span>
        </div>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          Live Offers
        </h1>
        <p className="mt-2 max-w-md mx-auto text-sm text-muted">
          Time-limited drops at exclusive prices. When the countdown hits zero, they&apos;re gone.
        </p>
      </div>

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : offers.length === 0 ? (
        <p className="text-center text-sm text-muted">No live offers at the moment. Check back soon!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => {
            const title = offer.customTitle ?? offer.product.name;
            const image =
              offer.product.thumbnail ?? offer.product.images?.[0]?.url ?? null;

            return (
              <Link
                key={offer.id}
                href={`/product/${offer.product.slug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--card-radius)] border border-border bg-surface card-hover"
              >
                <div className="relative aspect-square overflow-hidden bg-background">
                  {image ? (
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
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

                <div className="flex flex-1 flex-col p-5">
                  {offer.product.brand && (
                    <p className="mb-1 text-xs uppercase tracking-widest text-muted">
                      {offer.product.brand}
                    </p>
                  )}
                  <h2 className="mb-2 text-base font-medium text-white group-hover:text-lavender">
                    {title}
                  </h2>
                  {offer.customDescription && (
                    <p className="mb-3 text-sm text-muted line-clamp-2">
                      {offer.customDescription}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-lavender">
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
      )}
    </div>
  );
}
