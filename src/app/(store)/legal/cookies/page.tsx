import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | SMOKA",
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
        Cookie Policy
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-muted [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-lavender [&_h2]:mt-8 [&_h2]:mb-3">
        <p>Last updated: September 2026</p>
        <h2>What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device when you visit our website. They help us
          provide a better experience and enable essential functionality.
        </p>
        <h2>Cookies We Use</h2>
        <p>
          We use essential cookies for authentication, cart session management, and security. We may also
          use analytics cookies to understand how visitors use our site.
        </p>
        <h2>Managing Cookies</h2>
        <p>
          You can control cookies through your browser settings. Disabling essential cookies may affect
          site functionality such as cart and login features.
        </p>
      </div>
    </div>
  );
}
