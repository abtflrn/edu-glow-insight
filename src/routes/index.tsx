import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Building2,
  GraduationCap,
  LayoutGrid,
  PieChart as PieIcon,
  School as SchoolIcon,
  Sparkles,
  Trophy,
  Users,
  UsersRound,
} from "lucide-react";
import { loadEduData } from "@/lib/edu-data";
import { formatNumber, formatCompact, pct } from "@/lib/format";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Panel } from "@/components/dashboard/Panel";
import { FilterSelect } from "@/components/dashboard/FilterSelect";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { StageStatusBar, StageDonut, CityLeaderboard } from "@/components/dashboard/Charts";
import { SchoolTable } from "@/components/dashboard/SchoolTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Indonesia Education Insight Dashboard" },
      {
        name: "description",
        content:
          "Analisis distribusi sekolah dan demografi pendidikan di Indonesia: jenjang, status negeri vs swasta, dan populasi usia sekolah per provinsi.",
      },
      { property: "og:title", content: "Indonesia Education Insight Dashboard" },
      {
        property: "og:description",
        content: "Analisis Distribusi Sekolah dan Demografi Pendidikan di Indonesia.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["edu-data"],
    queryFn: loadEduData,
    staleTime: Infinity,
  });

  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [stage, setStage] = useState("");

  const cityOptions = useMemo(() => {
    if (!data) return [];
    if (!province) return data.cities;
    const pIdx = data.provinces.indexOf(province);
    const set = new Set<string>();
    for (const [c, p] of Object.entries(data.cityToProvince)) {
      if (p === pIdx) set.add(data.cities[Number(c)]);
    }
    return Array.from(set).sort();
  }, [data, province]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.schools.filter(
      (s) =>
        (!province || s.province === province) &&
        (!city || s.city === city) &&
        (!stage || s.stage === stage),
    );
  }, [data, province, city, stage]);

  const stats = useMemo(() => {
    const total = filtered.length;
    let negeri = 0;
    const byStageStatus: Record<string, { Negeri: number; Swasta: number }> = {};
    const byStage: Record<string, number> = {};
    const byCity: Record<string, number> = {};
    for (const s of filtered) {
      if (s.status === "Negeri") negeri++;
      (byStageStatus[s.stage] ??= { Negeri: 0, Swasta: 0 })[s.status]++;
      byStage[s.stage] = (byStage[s.stage] ?? 0) + 1;
      byCity[s.city] = (byCity[s.city] ?? 0) + 1;
    }
    const stageOrder = ["SD", "SDLB", "SMP", "SMPLB", "SMA", "SMK", "SMLB", "SLB"];
    const stageData = Object.entries(byStageStatus)
      .map(([k, v]) => ({ stage: k, ...v }))
      .sort((a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage));
    const donut = Object.entries(byStage)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const leaderboard = Object.entries(byCity)
      .map(([name, value]) => ({ name: name.replace(/^Kab\. |^Kota /, ""), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
      .reverse();

    // population (province-level)
    let pop = 0;
    let eduAge = 0;
    if (data) {
      const provIdxs = new Set<number>();
      if (province) provIdxs.add(data.provinces.indexOf(province));
      else if (city) provIdxs.add(data.cityToProvince[data.cities.indexOf(city)]);
      else data.provinces.forEach((_, i) => provIdxs.add(i));
      for (const i of provIdxs) {
        const p = data.population[String(i)];
        if (p) {
          pop += p[0];
          eduAge += p[1];
        }
      }
    }

    return { total, negeri, swasta: total - negeri, stageData, donut, leaderboard, pop, eduAge };
  }, [filtered, data, province, city]);

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-pink/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:py-10">
        {/* Header */}
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-pink-foreground glow-pink">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-balance font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                <span className="text-gradient">Indonesia Education</span> Insight Dashboard
              </h1>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                Analisis Distribusi Sekolah dan Demografi Pendidikan
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-border bg-card/70 p-4 shadow-card backdrop-blur">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink" />
            <span className="text-sm font-semibold text-foreground">Filter Global</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <FilterSelect
              label="Provinsi"
              value={province}
              options={data?.provinces ?? []}
              allLabel="Semua Provinsi"
              accent="pink"
              onChange={(v) => {
                setProvince(v);
                setCity("");
              }}
            />
            <FilterSelect
              label="Kota / Kabupaten"
              value={city}
              options={cityOptions}
              allLabel="Semua Kota/Kab."
              accent="blue"
              onChange={setCity}
            />
            <FilterSelect
              label="Jenjang"
              value={stage}
              options={data?.stages ?? []}
              allLabel="Semua Jenjang"
              accent="pink"
              onChange={setStage}
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* KPI Row */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                icon={SchoolIcon}
                label="Total Sekolah"
                value={formatNumber(stats.total)}
                accent="pink"
                sub={
                  <span className="text-xs text-muted-foreground">
                    di seluruh wilayah terpilih
                  </span>
                }
              />
              <KpiCard
                icon={Building2}
                label="Negeri vs Swasta"
                value={`${pct(stats.negeri, stats.total)} / ${pct(stats.swasta, stats.total)}`}
                accent="blue"
                sub={
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-pink/15 px-2 py-0.5 text-xs font-semibold text-pink">
                      Negeri {formatNumber(stats.negeri)}
                    </span>
                    <span className="rounded-lg bg-blue/15 px-2 py-0.5 text-xs font-semibold text-blue">
                      Swasta {formatNumber(stats.swasta)}
                    </span>
                  </div>
                }
              />
              <KpiCard
                icon={Users}
                label="Total Populasi"
                value={formatCompact(stats.pop)}
                accent="pink"
                sub={
                  <span className="text-xs text-muted-foreground">{formatNumber(stats.pop)} jiwa</span>
                }
              />
              <KpiCard
                icon={UsersRound}
                label="Populasi Usia Sekolah"
                value={formatCompact(stats.eduAge)}
                accent="blue"
                sub={
                  <span className="text-xs text-muted-foreground">
                    {pct(stats.eduAge, stats.pop)} dari total populasi
                  </span>
                }
              />
            </div>

            {/* Middle Row */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
              <Panel
                icon={LayoutGrid}
                title="Distribusi Jenjang per Status"
                subtitle="Negeri vs Swasta tiap jenjang"
                accent="pink"
                className="lg:col-span-3"
              >
                <StageStatusBar data={stats.stageData} />
              </Panel>
              <Panel
                icon={PieIcon}
                title="Proporsi Jenjang"
                subtitle="Sebaran jenjang sekolah"
                accent="blue"
                className="lg:col-span-2"
              >
                <StageDonut data={stats.donut} />
              </Panel>
            </div>

            {/* Bottom Row */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Panel
                icon={Trophy}
                title="Peringkat Wilayah"
                subtitle="Kota/Kab. dengan sekolah terbanyak"
                accent="pink"
              >
                <CityLeaderboard data={stats.leaderboard} />
              </Panel>
              <Panel
                icon={SchoolIcon}
                title="Daftar Sekolah"
                subtitle="Cari & telusuri data sekolah"
                accent="blue"
              >
                <SchoolTable schools={filtered} />
              </Panel>
            </div>

            <footer className="mt-8 text-center text-xs text-muted-foreground">
              {formatNumber(data?.schools.length ?? 0)} total sekolah · {data?.provinces.length ?? 0} provinsi · Data Pendidikan Indonesia
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-card shadow-card" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="h-80 animate-pulse rounded-2xl border border-border bg-card shadow-card lg:col-span-3" />
        <div className="h-80 animate-pulse rounded-2xl border border-border bg-card shadow-card lg:col-span-2" />
      </div>
      <p className="text-center text-sm text-muted-foreground">Memuat data pendidikan…</p>
    </div>
  );
}
