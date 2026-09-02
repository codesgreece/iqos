import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  const order = await prisma.order.findFirst({
    where: { id, userId: session!.user!.id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div>
      <Link href="/account/orders" className="text-sm text-muted hover:text-lavender mb-4 inline-block">
        ← Back to orders
      </Link>

      <h1 className="mb-2 text-2xl font-bold uppercase tracking-tight text-white">
        Order {order.orderNumber}
      </h1>
      <p className="mb-8 text-sm text-muted">
        Placed on {new Date(order.createdAt).toLocaleDateString("el-GR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-lavender">
            Items
          </h2>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-muted">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-white">{formatPrice(item.total)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-lavender">
              Status
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Order Status</dt>
                <dd className="text-white">{order.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Payment</dt>
                <dd className="text-white">{order.paymentStatus}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-lavender">
              Summary
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-white">{formatPrice(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted">Discount</dt>
                  <dd className="text-lavender">-{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="text-white">{formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <dt className="text-white">Total</dt>
                <dd className="text-lavender">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-lavender">
              Shipping Address
            </h2>
            <p className="text-sm text-muted">
              {order.firstName} {order.lastName}<br />
              {order.shippingAddress}<br />
              {order.shippingCity}, {order.shippingPostal}<br />
              {order.shippingCountry}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
