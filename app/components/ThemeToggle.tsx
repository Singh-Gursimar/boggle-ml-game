"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "boggle-theme";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const preferredTheme: Theme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    setTheme(preferredTheme);
    applyTheme(preferredTheme);
    setMounted(true);
  }, []);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";

  const handleToggle = () => {
    const updatedTheme = nextTheme;
    setTheme(updatedTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, updatedTheme);
    applyTheme(updatedTheme);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={!mounted}
      aria-label={`Switch to ${nextTheme} mode`}
      className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-900 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
    >
      {mounted ? (theme === "light" ? "Dark" : "Light") : "Theme"}
    </button>
  );
}
