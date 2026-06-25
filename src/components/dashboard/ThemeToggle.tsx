import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-card transition-all hover:scale-105 hover:glow-pink"
    >
      {dark ? <Sun className="h-5 w-5 text-pink" /> : <Moon className="h-5 w-5 text-blue" />}
    </button>
  );
}
