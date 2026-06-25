import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatNumber } from "@/lib/format";

const PINK = "var(--color-pink)";
const BLUE = "var(--color-blue)";
const DONUT = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-pink)",
  "var(--color-blue)",
  "var(--color-muted-foreground)",
];

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover/95 px-3 py-2 text-xs shadow-card backdrop-blur">
      <p className="mb-1 font-semibold text-popover-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.color || p.fill }} />
          {p.name}: <span className="font-semibold text-foreground">{formatNumber(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function StageStatusBar({ data }: { data: { stage: string; Negeri: number; Swasta: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} barGap={6} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="stage" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatCompact} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} content={<TooltipBox />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
        <Bar dataKey="Negeri" fill={PINK} radius={[8, 8, 0, 0]} animationDuration={700} maxBarSize={48} />
        <Bar dataKey="Swasta" fill={BLUE} radius={[8, 8, 0, 0]} animationDuration={700} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StageDonut({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Tooltip content={<TooltipBox />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={100}
          paddingAngle={3}
          stroke="var(--color-card)"
          strokeWidth={3}
          animationDuration={700}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={DONUT[i % DONUT.length]} />
          ))}
        </Pie>
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CityLeaderboard({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(320, data.length * 38)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
        <XAxis type="number" tickFormatter={formatCompact} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={130} tick={{ fill: "var(--color-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} content={<TooltipBox />} />
        <Bar dataKey="value" name="Sekolah" radius={[0, 8, 8, 0]} animationDuration={700} maxBarSize={26}>
          {data.map((_, i) => (
            <Cell key={i} fill={i % 2 === 0 ? PINK : BLUE} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
