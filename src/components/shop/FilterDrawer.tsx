"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Filters } from "./Filters";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  brands: string[];
}

export function FilterDrawer({ open, onClose, categories, brands }: FilterDrawerProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Filters"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-white"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Filters categories={categories} brands={brands} />
        </div>
      </aside>
    </>
  );
}
