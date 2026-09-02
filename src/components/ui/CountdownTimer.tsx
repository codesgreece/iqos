"use client";

import { useEffect, useState } from "react";
import { getRemainingTime } from "@/lib/live-offers";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endAt: Date | string;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function CountdownTimer({ endAt, className, size = "md", label = "ENDS IN" }: CountdownTimerProps) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const update = () => setTime(getRemainingTime(new Date(endAt)));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endAt]);

  if (time.total <= 0) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const sizeClasses = {
    sm: "text-sm gap-1",
    md: "text-base gap-2",
    lg: "text-lg gap-3",
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">{label}</span>
      )}
      <div className={cn("flex items-center font-mono font-bold text-lavender", sizeClasses[size])}>
        <TimeBlock value={pad(time.hours)} />
        <span className="text-violet">:</span>
        <TimeBlock value={pad(time.minutes)} />
        <span className="text-violet">:</span>
        <TimeBlock value={pad(time.seconds)} />
      </div>
    </div>
  );
}

function TimeBlock({ value }: { value: string }) {
  return (
    <span className="bg-surface border border-border rounded-lg px-2 py-1 min-w-[2.5rem] text-center">
      {value}
    </span>
  );
}
