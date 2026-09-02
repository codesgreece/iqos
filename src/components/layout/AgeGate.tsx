"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface AgeGateProps {
  enabled: boolean;
  minimumAge: number;
}

const STORAGE_KEY = "fba_age_verified";

export function AgeGate({ enabled, minimumAge }: AgeGateProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const verified = localStorage.getItem(STORAGE_KEY);
    if (!verified) setVisible(true);
  }, [enabled]);

  function handleConfirm() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  function handleDecline() {
    window.location.href = "https://www.google.com";
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[var(--card-radius)] border border-border bg-surface p-8 text-center animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
          Age Verification
        </p>
        <h2 className="mt-3 text-xl font-bold text-white">
          Are you {minimumAge} or older?
        </h2>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          This website contains products that may be restricted to adults. You must be at least{" "}
          {minimumAge} years old to enter.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" className="flex-1" onClick={handleConfirm}>
            Yes, I am {minimumAge}+
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleDecline}>
            No, exit
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted">
          By entering, you confirm you meet the legal age requirements in your jurisdiction.
        </p>
      </div>
    </div>
  );
}
