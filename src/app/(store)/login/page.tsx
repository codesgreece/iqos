"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white">Sign In</h1>
        <p className="mt-2 text-sm text-muted">Welcome back to SMOKA</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-[var(--card-radius)] border border-border bg-surface p-6">
        <Input name="email" label="Email" type="email" required />
        <Input name="password" label="Password" type="password" required />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Sign In
        </Button>

        <div className="text-center text-sm text-muted">
          <Link href="/forgot-password" className="text-lavender hover:text-white transition-colors">
            Forgot password?
          </Link>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-lavender hover:text-white transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
