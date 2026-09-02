import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SuccessPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const sp = await searchParams;
  const orderNumber = sp.order as string | undefined;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet/20">
        <CheckCircle className="h-8 w-8 text-lavender" />
      </div>

      <h1 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
        Order Confirmed
      </h1>

      <p className="mt-4 text-sm text-muted">
        Thank you for your order! We&apos;ll send you a confirmation email shortly.
      </p>

      {orderNumber && (
        <p className="mt-4 text-sm">
          <span className="text-muted">Order number: </span>
          <span className="font-mono font-semibold text-lavender">{orderNumber}</span>
        </p>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/account/orders">
          <Button variant="primary">View Orders</Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
