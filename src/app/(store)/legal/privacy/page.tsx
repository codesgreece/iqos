import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SMOKA",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
        Privacy Policy
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-muted [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-lavender [&_h2]:mt-8 [&_h2]:mb-3">
        <p>Last updated: September 2026</p>
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide when creating an account, placing an order, or contacting us.
          This includes name, email, phone number, shipping address, and payment information.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We use your information to process orders, communicate about your purchases, improve our services,
          and send marketing communications if you opt in.
        </p>
        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. Payment data
          is processed through secure third-party providers.
        </p>
        <h2>Your Rights</h2>
        <p>
          You may request access, correction, or deletion of your personal data by contacting us at
          contact@smoka.com.
        </p>
      </div>
    </div>
  );
}
