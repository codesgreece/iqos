import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/limited-editions", label: "Limited Editions" },
      { href: "/categories", label: "Categories" },
      { href: "/offers", label: "Live Offers" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/legal/shipping", label: "Shipping & Delivery" },
      { href: "/legal/returns", label: "Returns & Exchanges" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/blog", label: "Journal" },
      { href: "/collectors", label: "Collector's Guide" },
      { href: "/authenticity", label: "Authenticity" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/cookies", label: "Cookie Policy" },
      { href: "/legal/age", label: "Age Verification" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: "mailto:contact@smoka.com", label: "contact@smoka.com" },
      { href: "/contact", label: "Get in Touch" },
      { href: "/stores", label: "Store Locator" },
    ],
  },
] as const;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer({
  storeName = "SMOKA",
  social,
}: {
  storeName?: string;
  social?: { instagram: string; facebook: string; twitter: string; tiktok: string };
} = {}) {
  const year = new Date().getFullYear();

  const socialLinks = [
    { href: social?.instagram || "https://instagram.com", label: "Instagram", icon: InstagramIcon },
    { href: social?.facebook || "https://facebook.com", label: "Facebook", icon: FacebookIcon },
    { href: social?.twitter || "https://twitter.com", label: "Twitter", icon: TwitterIcon },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-8 border-b border-border pb-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              className="text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-lavender"
            >
              {storeName}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Rare • Limited • Exclusive. Curated products for collectors who demand something extraordinary.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-lg border border-border p-2.5 text-muted transition-all hover:border-border-hover hover:bg-background hover:text-lavender"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-lavender">
                  {column.title}
                </h3>
                <ul className="space-y-2.5">
                  {column.links.map(({ href, label }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-muted transition-colors hover:text-white"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted">
            &copy; {year} {storeName}. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Crafted for collectors. Designed in Athens.
          </p>
        </div>
      </div>
    </footer>
  );
}
