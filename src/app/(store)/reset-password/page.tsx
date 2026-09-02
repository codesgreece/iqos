"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Reset failed");
        return;
      }

      const data = json.data ?? json;
      setMessage(data.message ?? "Password reset successfully. You can now sign in.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-red-400 text-center">
        Invalid reset link. Please request a new one.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[var(--card-radius)] border border-border bg-surface p-6">
      <Input name="password" label="New Password" type="password" required minLength={8} />

      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-lavender">{message}</p>}

      <Button type="submit" variant="primary" className="w-full" loading={loading}>
        Reset Password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white">New Password</h1>
        <p className="mt-2 text-sm text-muted">Enter your new password below</p>
      </div>

      <Suspense>
        <ResetPasswordForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-lavender hover:text-white transition-colors">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
