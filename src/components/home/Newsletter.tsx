"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { error: toastError } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        toastError("Failed to subscribe");
      }
    } catch {
      setStatus("error");
      toastError("Something went wrong");
    }
  }

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
            Stay Ahead
          </span>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
            Join the Drop List
          </h2>
          <p className="mt-3 text-sm text-muted">
            Be the first to know about limited releases, live offers, and exclusive collector drops.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" variant="primary" loading={status === "loading"} className="shrink-0">
              Subscribe
            </Button>
          </form>

          {status === "success" && (
            <p className="mt-4 text-sm text-lavender">Thanks for subscribing!</p>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm text-red-400">Something went wrong. Please try again.</p>
          )}

          <p className="mt-4 text-xs text-muted">
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </div>
      </div>
    </section>
  );
}
