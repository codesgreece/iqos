import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-amethyst/30 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="max-w-4xl text-4xl font-bold uppercase leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in">
          FINAL BOSS ACTIVITY
        </h1>

        <p className="mt-6 max-w-2xl text-lg font-medium uppercase tracking-[0.2em] text-lavender sm:text-xl md:text-2xl animate-fade-in">
          Rare. Limited. Unforgettable.
        </p>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg animate-fade-in">
          Discover curated drops and collector-grade pieces — available only while supplies last.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6 animate-fade-in">
          <Link href="/shop">
            <Button variant="primary" size="lg" className="min-w-[200px] purple-glow">
              Shop Now
            </Button>
          </Link>
          <Link href="/limited-editions">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Explore Limited Editions
            </Button>
          </Link>
        </div>

        <div
          className="mt-16 h-px w-full max-w-md bg-gradient-to-r from-transparent via-violet/50 to-transparent"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
