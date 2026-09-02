import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default async function AccountDashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [orderCount, recentOrders, wishlistCount] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
      },
    }),
    prisma.wishlistItem.count({
      where: { wishlist: { userId } },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold uppercase tracking-tight text-white">
        Dashboard
      </h1>
      <p className="mb-8 text-sm text-muted">
        Welcome back, {session!.user!.name ?? session!.user!.email}
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <div className="rounded-[var(--card-radius)] border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-widest text-muted">Orders</p>
          <p className="mt-1 text-2xl font-bold text-lavender">{orderCount}</p>
        </div>
        <div className="rounded-[var(--card-radius)] border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-widest text-muted">Wishlist</p>
          <p className="mt-1 text-2xl font-bold text-lavender">{wishlistCount}</p>
        </div>
        <div className="rounded-[var(--card-radius)] border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-widest text-muted">Account</p>
          <p className="mt-1 text-sm text-white truncate">{session!.user!.email}</p>
        </div>
      </div>

      <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-lavender">
            Recent Orders
          </h2>
          <Link href="/account/orders" className="text-xs text-muted hover:text-lavender">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
              >
                <div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-sm font-medium text-white hover:text-lavender"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("el-GR")} · {order.status}
                  </p>
                </div>
                <span className="text-sm font-semibold text-lavender">
                  {formatPrice(order.total)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Link href="/shop" className="mt-6 block">
          <Button variant="outline" size="sm">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
