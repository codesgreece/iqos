"use client";

interface ChartBar {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  title: string;
  data: ChartBar[];
  formatValue?: (v: number) => string;
  className?: string;
}

export function SimpleBarChart({ title, data, formatValue, className }: SimpleBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const fmt = formatValue ?? ((v: number) => String(v));

  return (
    <div className={className}>
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      <div className="space-y-3">
        {data.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted">{bar.label}</span>
              <span className="text-lavender">{fmt(bar.value)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-violet transition-all duration-500"
                style={{ width: `${(bar.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SimpleLineChartProps {
  title: string;
  data: ChartBar[];
  formatValue?: (v: number) => string;
  className?: string;
}

export function SimpleLineChart({ title, data, formatValue, className }: SimpleLineChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const fmt = formatValue ?? ((v: number) => String(v));
  const width = 100;
  const height = 60;
  const padding = 4;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <div className={className}>
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
        <polyline
          fill="none"
          stroke="var(--violet)"
          strokeWidth="1.5"
          points={points.join(" ")}
        />
        {data.map((d, i) => {
          const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
          const y = height - padding - (d.value / max) * (height - padding * 2);
          return <circle key={d.label} cx={x} cy={y} r="2" fill="var(--lavender)" />;
        })}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-muted">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
      <p className="mt-2 text-right text-sm font-semibold text-lavender">
        Total: {fmt(data.reduce((s, d) => s + d.value, 0))}
      </p>
    </div>
  );
}
