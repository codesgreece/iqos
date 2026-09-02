"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      if (res.ok) {
        success("Message sent! We'll get back to you soon.");
        e.currentTarget.reset();
      } else {
        error("Failed to send message. Please try again.");
      }
    } catch {
      error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">Contact</span>
      <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">Get in Touch</h1>
      <p className="mt-3 text-sm text-muted">
        Questions about a product, order, or limited drop? We&apos;re here to help.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="name" label="Name" required />
          <Input name="email" label="Email" type="email" required />
        </div>
        <Input name="subject" label="Subject" required />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">Message</label>
          <textarea
            name="message"
            required
            rows={6}
            className="w-full rounded-[var(--button-radius)] border border-border bg-surface px-4 py-2.5 text-white placeholder:text-muted/60 focus:border-lavender/50 focus:outline-none"
          />
        </div>
        <Button type="submit" variant="primary" loading={loading}>
          Send Message
        </Button>
      </form>

      <div className="mt-12 rounded-[var(--card-radius)] border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-lavender">
          Direct Contact
        </h2>
        <p className="mt-3 text-sm text-muted">
          Email:{" "}
          <a href="mailto:contact@finalbossactivity.com" className="text-lavender hover:underline">
            contact@finalbossactivity.com
          </a>
        </p>
        <p className="mt-2 text-sm text-muted">
          Prefer WhatsApp? Use the floating button on any page.
        </p>
      </div>
    </div>
  );
}
