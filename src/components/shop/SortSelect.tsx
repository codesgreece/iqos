"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Popular" },
  { value: "limited", label: "Limited Editions" },
] as const;

export type ShopSort = (typeof SORT_OPTIONS)[number]["value"];

interface SortSelectProps {
  className?: string;
}

export function SortSelect({ className }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "featured";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", e.target.value);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className={cn(
        "rounded-[var(--button-radius)] border border-border bg-surface px-4 py-2.5 text-sm text-white",
        "focus:outline-none focus:border-lavender/50 transition-colors",
        className
      )}
      aria-label="Sort products"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-surface">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function mapSortToFilters(sort: string): {
  sort?: "price-asc" | "price-desc" | "newest" | "popular";
  isLimited?: boolean;
  isFeatured?: boolean;
} {
  switch (sort) {
    case "price-asc":
      return { sort: "price-asc" as const };
    case "price-desc":
      return { sort: "price-desc" as const };
    case "newest":
      return { sort: "newest" as const };
    case "limited":
      return { isLimited: true, sort: "newest" as const };
    case "featured":
      return { isFeatured: true, sort: "newest" as const };
    case "popular":
      return { sort: "popular" as const };
    default:
      return { sort: "newest" as const };
  }
}
