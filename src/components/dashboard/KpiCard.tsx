import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: ReactNode;
  accent?: "pink" | "blue";
}

export function KpiCard({ icon: Icon, label, value, sub, accent = "pink" }: Props) {
  const iconWrap =
    accent === "pink"
      ? "bg-gradient-primary text-pink-foreground"
      : "bg-blue text-blue-foreground";
  return (
    <div className="card-hover group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconWrap}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {sub && <div className="mt-4">{sub}</div>}
    </div>
  );
}
