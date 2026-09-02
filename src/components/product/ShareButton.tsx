"use client";

import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        setOpen(false);
      } catch {
        /* user cancelled */
      }
    } else {
      setOpen(!open);
    }
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={handleNativeShare}
        className="flex items-center gap-2 rounded-[var(--button-radius)] border border-border px-4 py-2.5 text-sm text-muted transition-colors hover:border-border-hover hover:text-white"
        aria-label="Share product"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {open && typeof navigator !== "undefined" && !navigator.share && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-[var(--button-radius)] border border-border bg-surface p-2 shadow-lg">
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white hover:bg-background"
          >
            {copied ? <Check className="h-4 w-4 text-lavender" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
