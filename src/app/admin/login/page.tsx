"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials or insufficient permissions");
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if (session?.user?.role !== "ADMIN") {
      await signOut({ redirect: false });
      setError("Admin access required");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Admin Panel</p>
          <Image
            src="/smoka-logo.jpg"
            alt="SMOKA"
            width={200}
            height={80}
            className="mx-auto mt-4 h-16 w-auto"
            priority
          />
          <p className="mt-3 text-sm text-muted">Sign in with your admin account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--card-radius)] border border-border bg-surface p-8 purple-glow"
        >
          {error && (
            <div className="mb-4 rounded-[var(--button-radius)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smoka.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="mt-6 w-full" loading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
