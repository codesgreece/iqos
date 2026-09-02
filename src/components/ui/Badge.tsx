import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "limited" | "rare" | "new" | "sale" | "live" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    limited: "bg-lavender/10 text-lavender border-lavender/30",
    rare: "bg-violet/20 text-lavender border-violet/40",
    new: "bg-white/10 text-white border-white/20",
    sale: "bg-violet/20 text-lavender border-violet/30",
    live: "bg-violet text-white border-violet animate-pulse",
    default: "bg-surface text-muted border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
