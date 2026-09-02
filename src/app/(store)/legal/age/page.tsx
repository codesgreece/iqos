import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Age Verification",
  description: "Age verification policy for FINAL BOSS ACTIVITY.",
};

export default function AgeVerificationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-white md:text-3xl">Age Verification</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <p>
          FINAL BOSS ACTIVITY sells products that may be subject to age restrictions under Greek
          and European law. You must be at least 18 years old to browse and purchase from our store.
        </p>
        <h2 className="text-lg font-semibold text-white">Our Policy</h2>
        <p>
          We implement age verification at entry to ensure compliance with applicable regulations.
          By confirming your age, you declare that you meet the minimum legal age requirement in
          your jurisdiction.
        </p>
        <h2 className="text-lg font-semibold text-white">Restricted Sales</h2>
        <p>
          We do not knowingly sell regulated products to minors. Orders may be cancelled if age
          verification cannot be confirmed. Production checkout for regulated products must comply
          with all applicable Greek and EU legislation before activation.
        </p>
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <p>
          Questions about our age verification policy?{" "}
          <Link href="/contact" className="text-lavender hover:underline">
            Contact us
          </Link>
          .
        </p>
      </div>
      <div className="mt-10">
        <Link href="/shop">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </div>
    </div>
  );
}
