"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { MobileNav } from "./MobileNav";
import { SearchAutocomplete } from "./SearchAutocomplete";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/limited-editions", label: "Limited Editions" },
  { href: "/offers", label: "Live Offers" },
] as const;

interface HeaderProps {
  logo?: string;
  storeName?: string;
}

export function Header({ logo = "/smoka-logo.jpg", storeName = "SMOKA" }: HeaderProps) {
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all duration-300",
          scrolled
            ? "border-border bg-background/75 backdrop-blur-xl shadow-[0_4px_24px_rgba(13,11,20,0.6)]"
            : "border-transparent bg-background/40 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-lavender sm:text-base"
          >
            {logo ? (
              <Image src={logo} alt={storeName} width={120} height={48} className="h-10 w-auto" priority />
            ) : (
              storeName
            )}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-lavender" : "text-muted hover:text-white"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden w-48 xl:block">
            <SearchAutocomplete />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-white xl:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/account/wishlist"
              className="hidden rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-white sm:inline-flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              href="/account"
              className="hidden rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-white md:inline-flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-white"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cart.itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet text-[10px] font-bold text-white">
                  {cart.itemCount > 9 ? "9+" : cart.itemCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 p-4 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3 pt-4">
            <SearchAutocomplete className="flex-1" onClose={() => setSearchOpen(false)} />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="rounded-lg p-2 text-muted hover:text-white"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
