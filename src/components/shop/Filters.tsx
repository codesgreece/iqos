"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

interface FiltersProps {
  categories: Category[];
  brands: string[];
  className?: string;
}

export function Filters({ categories, brands, className }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  function toggleBoolParam(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === "true") {
      params.delete(key);
    } else {
      params.set(key, "true");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  const activeCategory = searchParams.get("category");
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const availability = searchParams.get("availability");
  const brand = searchParams.get("brand");
  const isLimited = searchParams.get("limited") === "true";
  const isRare = searchParams.get("rare") === "true";
  const onSale = searchParams.get("sale") === "true";

  return (
    <div className={cn("space-y-6", className)}>
      <FilterSection title="Category">
        <ul className="space-y-1">
          <li>
            <FilterLink
              active={!activeCategory}
              onClick={() => updateParam("category", null)}
            >
              All Categories
            </FilterLink>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <FilterLink
                active={activeCategory === cat.slug}
                onClick={() => updateParam("category", cat.slug)}
              >
                {cat.name}
                {cat.productCount != null && (
                  <span className="ml-1 text-muted">({cat.productCount})</span>
                )}
              </FilterLink>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Price">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateParam("minPrice", e.target.value || null)}
            className="w-full rounded-[var(--button-radius)] border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted/60 focus:outline-none focus:border-lavender/50"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateParam("maxPrice", e.target.value || null)}
            className="w-full rounded-[var(--button-radius)] border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted/60 focus:outline-none focus:border-lavender/50"
          />
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <ul className="space-y-1">
          <li>
            <FilterLink
              active={!availability}
              onClick={() => updateParam("availability", null)}
            >
              All
            </FilterLink>
          </li>
          <li>
            <FilterLink
              active={availability === "in_stock"}
              onClick={() => updateParam("availability", "in_stock")}
            >
              In Stock
            </FilterLink>
          </li>
          <li>
            <FilterLink
              active={availability === "out_of_stock"}
              onClick={() => updateParam("availability", "out_of_stock")}
            >
              Out of Stock
            </FilterLink>
          </li>
        </ul>
      </FilterSection>

      {brands.length > 0 && (
        <FilterSection title="Brand">
          <ul className="space-y-1">
            <li>
              <FilterLink active={!brand} onClick={() => updateParam("brand", null)}>
                All Brands
              </FilterLink>
            </li>
            {brands.map((b) => (
              <li key={b}>
                <FilterLink
                  active={brand === b}
                  onClick={() => updateParam("brand", b)}
                >
                  {b}
                </FilterLink>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      <FilterSection title="Special">
        <ul className="space-y-2">
          <li>
            <FilterCheckbox
              label="Limited Edition"
              checked={isLimited}
              onChange={() => toggleBoolParam("limited")}
            />
          </li>
          <li>
            <FilterCheckbox
              label="Rare"
              checked={isRare}
              onChange={() => toggleBoolParam("rare")}
            />
          </li>
          <li>
            <FilterCheckbox
              label="On Sale"
              checked={onSale}
              onChange={() => toggleBoolParam("sale")}
            />
          </li>
        </ul>
      </FilterSection>

      <button
        type="button"
        onClick={() => router.push("/shop")}
        className="text-sm text-muted hover:text-lavender transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-lavender">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FilterLink({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-sm transition-colors",
        active ? "text-lavender font-medium" : "text-muted hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-border bg-background accent-violet"
      />
      <span className="text-sm text-muted">{label}</span>
    </label>
  );
}
