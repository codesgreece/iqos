"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function AccountSettingsPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-white">
        Settings
      </h1>

      <div className="space-y-6 max-w-md">
        <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-lavender">
            Account
          </h2>
          <p className="mb-4 text-sm text-muted">
            Sign out of your FINAL BOSS ACTIVITY account on this device.
          </p>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </Button>
        </div>

        <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-lavender">
            Legal
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/legal/terms" className="text-muted hover:text-lavender transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/legal/privacy" className="text-muted hover:text-lavender transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/legal/cookies" className="text-muted hover:text-lavender transition-colors">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
