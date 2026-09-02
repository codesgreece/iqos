"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryImage {
  url: string;
  alt?: string | null;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const galleryImages =
    images.length > 0 ? images : [{ url: "", alt: productName }];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = galleryImages[activeIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-[var(--card-radius)] border border-border bg-surface">
        {active.url ? (
          <Image
            src={active.url}
            alt={active.alt ?? productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-amethyst/20">
            <span className="text-sm uppercase tracking-widest text-muted">No image</span>
          </div>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-colors",
                i === activeIndex
                  ? "border-lavender"
                  : "border-border hover:border-border-hover"
              )}
            >
              {img.url ? (
                <Image
                  src={img.url}
                  alt={img.alt ?? `${productName} ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-amethyst/20 text-xs text-muted">
                  —
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
