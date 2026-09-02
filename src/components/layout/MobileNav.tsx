"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Search, Heart, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/limited-editions", label: "Limited Editions" },
  { href: "/offers", label: "Live Offers" },
] as const;

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-surface border-l border-border animate-slide-in-right"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <span className="text-sm font-semibold uppercase tracking-widest text-lavender">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-1">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-violet/20 text-lavender"
                        : "text-muted hover:bg-background hover:text-white"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 border-t border-border pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              Quick Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/search"
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm text-muted transition-colors hover:border-border-hover hover:text-white"
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
              <Link
                href="/account/wishlist"
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm text-muted transition-colors hover:border-border-hover hover:text-white"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm text-muted transition-colors hover:border-border-hover hover:text-white"
              >
                <User className="h-4 w-4" />
                Account
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm text-muted transition-colors hover:border-border-hover hover:text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                Cart
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-6 py-4">
          <p className="text-center text-xs text-muted">
            FINAL BOSS ACTIVITY
          </p>
        </div>
      </nav>
    </>
  );
}
