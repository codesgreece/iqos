"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface UserProfile {
  name: string | null;
  email: string;
  phone: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data.data ?? data))
      .catch(() => setError("Failed to load profile"));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name") as string,
      phone: (formData.get("phone") as string) || undefined,
    };

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Update failed");
        return;
      }
      setProfile(json.data ?? json);
      setMessage("Profile updated successfully");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!profile) {
    return <p className="text-sm text-muted">Loading profile...</p>;
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-white">
        Profile
      </h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4 rounded-[var(--card-radius)] border border-border bg-surface p-6">
        <Input name="name" label="Full Name" defaultValue={profile.name ?? ""} />
        <Input name="email" label="Email" type="email" value={profile.email} disabled />
        <Input name="phone" label="Phone" type="tel" defaultValue={profile.phone ?? ""} />

        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-lavender">{message}</p>}

        <Button type="submit" variant="primary" loading={loading}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
