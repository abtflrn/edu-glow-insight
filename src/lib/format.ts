export function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID").format(Math.round(n));
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000_000_000) return (n / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + " T";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " M";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + " Jt";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + " Rb";
  return String(Math.round(n));
}

export function pct(part: number, total: number): string {
  if (!total) return "0%";
  return Math.round((part / total) * 100) + "%";
}
