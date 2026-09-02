import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      total: true,
      createdAt: true,
      items: { select: { quantity: true } },
    },
  });

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-white">
        Order History
      </h1>

      {orders.length === 0 ? (
        <p className="text-sm text-muted">No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => {
            const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <li
                key={order.id}
                className="flex items-center justify-between rounded-[var(--card-radius)] border border-border bg-surface px-5 py-4"
              >
                <div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="font-medium text-white hover:text-lavender"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString("el-GR")} · {itemCount} items · {order.status}
                  </p>
                </div>
                <span className="font-semibold text-lavender">{formatPrice(order.total)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
