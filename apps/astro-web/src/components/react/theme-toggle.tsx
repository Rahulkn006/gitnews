"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read current theme from DOM on mount
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
    setMounted(true);

    // Listen for theme changes from other sources (e.g., other tabs, next-themes)
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";

    // Update DOM immediately
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Persist to localStorage (same key used by next-themes and the inline script)
    localStorage.setItem("theme", newTheme);

    // Notify next-themes ThemeProvider (it listens to storage events)
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "theme",
        newValue: newTheme,
      }),
    );

    setIsDark(newTheme === "dark");
  };

  if (!mounted) {
    return (
      <button className="p-2 rounded-md border border-border bg-card text-muted-foreground animate-pulse">
        <span className="sr-only">Loading theme</span>◐
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-border bg-card text-foreground hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      )}
    </button>
  );
}
