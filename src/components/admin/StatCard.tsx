import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "warning" | "success";
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const variants = {
    default: "border-border bg-surface",
    warning: "border-amber-500/30 bg-amber-500/5",
    success: "border-violet/30 bg-violet/5",
  };

  const iconVariants = {
    default: "bg-amethyst/20 text-lavender",
    warning: "bg-amber-500/20 text-amber-400",
    success: "bg-violet/20 text-lavender",
  };

  return (
    <div
      className={cn(
        "rounded-[var(--card-radius)] border p-5 transition-colors hover:border-border-hover",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          {trend && <p className="mt-1 text-xs text-muted">{trend}</p>}
        </div>
        <div className={cn("rounded-lg p-2.5", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
