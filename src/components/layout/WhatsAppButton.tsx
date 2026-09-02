"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WhatsAppSettings {
  enabled: boolean;
  number: string;
  message: string;
}

interface WhatsAppButtonProps {
  settings: WhatsAppSettings;
  className?: string;
}

export function WhatsAppButton({ settings, className }: WhatsAppButtonProps) {
  if (!settings.enabled || !settings.number) return null;

  const cleanNumber = settings.number.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(settings.message || "Hello!");
  const href = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full",
        "bg-[#25D366] text-white shadow-lg transition-all duration-300",
        "hover:scale-105 hover:shadow-[0_8px_32px_rgba(37,211,102,0.4)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" strokeWidth={0} />
    </a>
  );
}
