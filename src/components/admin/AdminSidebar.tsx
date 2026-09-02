"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Zap,
  ShoppingCart,
  Users,
  Tag,
  Image,
  Warehouse,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/live-offers", label: "Live Offers", icon: Zap },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/discounts", label: "Discounts", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-[#0A0810]">
      <div className="border-b border-border px-6 py-5">
        <Link href="/admin" className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">Admin</span>
          <span className="mt-0.5 block text-sm font-bold text-lavender">FINAL BOSS ACTIVITY</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--button-radius)] px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amethyst/30 text-lavender border border-violet/20"
                      : "text-muted hover:bg-surface hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-[var(--button-radius)] px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
