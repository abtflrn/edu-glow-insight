import { ChevronDown } from "lucide-react";

interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  allLabel: string;
  accent?: "pink" | "blue";
}

export function FilterSelect({ label, value, options, onChange, allLabel, accent = "pink" }: Props) {
  const ring =
    accent === "pink"
      ? "hover:border-pink focus:ring-pink"
      : "hover:border-blue focus:ring-blue";
  const icon = accent === "pink" ? "text-pink" : "text-blue";
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <label className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none truncate rounded-2xl border border-border bg-card py-3 pl-4 pr-10 text-sm font-medium text-foreground shadow-card outline-none transition-all focus:ring-2 ${ring}`}
        >
          <option value="">{allLabel}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${icon}`}
        />
      </div>
    </div>
  );
}
