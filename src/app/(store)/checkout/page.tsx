import { Suspense } from "react";
import CheckoutPage from "./CheckoutPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-12 text-center text-muted">Loading checkout...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
