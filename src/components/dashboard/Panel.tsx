import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  accent?: "pink" | "blue";
  className?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function Panel({ icon: Icon, title, subtitle, accent = "pink", className = "", children, action }: Props) {
  const iconWrap =
    accent === "pink" ? "bg-gradient-primary text-pink-foreground" : "bg-blue text-blue-foreground";
  return (
    <section
      className={`rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card sm:p-6 ${className}`}
    >
      <div className="mb-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconWrap}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-bold text-foreground sm:text-lg">{title}</h3>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action ?? <span />}
      </div>
      {children}
    </section>
  );
}
