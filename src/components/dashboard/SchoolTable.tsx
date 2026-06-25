import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { School } from "@/lib/edu-data";
import { formatNumber } from "@/lib/format";

const PAGE_SIZE = 8;

export function SchoolTable({ schools }: { schools: School[] }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    if (!debounced) return schools;
    return schools.filter((s) => s.name.toLowerCase().includes(debounced));
  }, [schools, debounced]);

  useEffect(() => setPage(0), [debounced, schools]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="flex h-full flex-col">
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pink" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama sekolah..."
          className="w-full rounded-2xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-pink focus:ring-2 focus:ring-pink"
        />
      </div>

      <div className="-mx-1 flex-1 overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-1.5 px-1 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-1 font-semibold">Nama Sekolah</th>
              <th className="px-3 py-1 font-semibold">Jenjang</th>
              <th className="px-3 py-1 font-semibold">Status</th>
              <th className="px-3 py-1 font-semibold">Kecamatan</th>
              <th className="px-3 py-1 font-semibold">Kota/Kab.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s, i) => (
              <tr key={i} className="bg-muted/40 transition-colors hover:bg-accent/60">
                <td className="max-w-[200px] truncate rounded-l-xl px-3 py-2.5 font-medium text-foreground" title={s.name}>
                  {s.name}
                </td>
                <td className="px-3 py-2.5">
                  <span className="rounded-lg bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {s.stage}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
                      s.status === "Negeri"
                        ? "bg-pink/15 text-pink"
                        : "bg-blue/15 text-blue"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="max-w-[140px] truncate px-3 py-2.5 text-muted-foreground" title={s.district}>
                  {s.district}
                </td>
                <td className="max-w-[140px] truncate rounded-r-xl px-3 py-2.5 text-muted-foreground" title={s.city}>
                  {s.city}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-muted-foreground">
                  Tidak ada sekolah ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {formatNumber(filtered.length)} sekolah · Hal. {safePage + 1}/{pageCount}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-foreground transition-all hover:glow-pink disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-foreground transition-all hover:glow-blue disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
