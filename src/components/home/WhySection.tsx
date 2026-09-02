import { Shield, Sparkles, Truck, Award } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    description: "Every item verified. No fakes, no compromises — only the real deal.",
  },
  {
    icon: Sparkles,
    title: "Curated Selection",
    description: "Hand-picked drops chosen for collectors who demand something extraordinary.",
  },
  {
    icon: Truck,
    title: "Fast & Secure Shipping",
    description: "Carefully packaged and shipped within 2–5 business days across Europe.",
  },
  {
    icon: Award,
    title: "Collector Community",
    description: "Join a community of enthusiasts who appreciate rarity and quality.",
  },
] as const;

export function WhySection() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center md:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
            Why Us
          </span>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
            Why Final Boss Activity
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted">
            Built for collectors who know the difference between ordinary and unforgettable.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-[var(--card-radius)] border border-border bg-background p-6 card-hover"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet/20">
                <Icon className="h-6 w-6 text-lavender" />
              </div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
