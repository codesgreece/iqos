"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Request failed");
        return;
      }

      const data = json.data ?? json;
      setMessage(data.message ?? "If an account exists, a reset link has been sent.");
      if (data.resetUrl) {
        setMessage(`${data.message} Dev link: ${data.resetUrl}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white">Reset Password</h1>
        <p className="mt-2 text-sm text-muted">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-[var(--card-radius)] border border-border bg-surface p-6">
        <Input name="email" label="Email" type="email" required />

        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-lavender">{message}</p>}

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-lavender hover:text-white transition-colors">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
