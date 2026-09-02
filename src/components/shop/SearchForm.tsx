"use client";

import { useState } from "react";

export function SearchForm({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);

  return (
    <form action="/search" method="GET" className="mb-10 max-w-xl">
      <div className="flex gap-3">
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 rounded-[var(--button-radius)] border border-border bg-surface px-4 py-2.5 text-white placeholder:text-muted/60 focus:outline-none focus:border-lavender/50"
        />
        <button
          type="submit"
          className="rounded-[var(--button-radius)] bg-violet px-6 py-2.5 text-sm font-medium text-white hover:bg-amethyst transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
