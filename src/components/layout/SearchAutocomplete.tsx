"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface SuggestionProduct {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  thumbnail: string | null;
  price: number;
  salePrice: number | null;
}

interface SearchResults {
  query: string;
  products: SuggestionProduct[];
  categories: { id: string; name: string; slug: string }[];
  brands: string[];
}

interface SearchAutocompleteProps {
  className?: string;
  onClose?: () => void;
}

export function SearchAutocomplete({ className, onClose }: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.data ?? data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      onClose?.();
    }
  }

  const hasResults =
    results &&
    (results.products.length > 0 ||
      results.categories.length > 0 ||
      results.brands.length > 0);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products..."
          className="w-full rounded-[var(--button-radius)] border border-border bg-surface py-2 pl-9 pr-9 text-sm text-white placeholder:text-muted/60 focus:border-lavender/50 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults(null);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {open && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[var(--card-radius)] border border-border bg-surface shadow-xl">
          {loading && (
            <p className="px-4 py-3 text-sm text-muted">Searching...</p>
          )}
          {!loading && !hasResults && (
            <p className="px-4 py-3 text-sm text-muted">No products found.</p>
          )}
          {!loading && hasResults && (
            <div className="max-h-80 overflow-y-auto">
              {results!.products.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-widest text-muted">
                    Products
                  </p>
                  {results!.products.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onClose?.();
                      }}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-background"
                    >
                      {p.thumbnail ? (
                        <Image
                          src={p.thumbnail}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-amethyst/20" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-white">{p.name}</p>
                        {p.brand && (
                          <p className="text-xs text-muted">{p.brand}</p>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-lavender">
                        {formatPrice(p.salePrice ?? p.price)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
              {results!.categories.length > 0 && (
                <div className="border-t border-border p-2">
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-widest text-muted">
                    Categories
                  </p>
                  {results!.categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onClose?.();
                      }}
                      className="block rounded-lg px-2 py-2 text-sm text-white hover:bg-background"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
              {results!.brands.length > 0 && (
                <div className="border-t border-border p-2">
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-widest text-muted">
                    Brands
                  </p>
                  {results!.brands.map((b) => (
                    <Link
                      key={b}
                      href={`/shop?brand=${encodeURIComponent(b!)}`}
                      onClick={() => {
                        setOpen(false);
                        onClose?.();
                      }}
                      className="block rounded-lg px-2 py-2 text-sm text-white hover:bg-background"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              )}
              <div className="border-t border-border p-2">
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setOpen(false);
                    onClose?.();
                  }}
                  className="w-full rounded-lg px-2 py-2 text-left text-sm text-lavender hover:bg-background"
                >
                  View all results for &ldquo;{query}&rdquo;
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
