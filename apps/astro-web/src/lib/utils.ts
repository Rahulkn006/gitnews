// Shared utility functions for GitNews components

export const langColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-emerald-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-600",
  HTML: "bg-red-500",
  CSS: "bg-purple-500",
  Markdown: "bg-zinc-500",
  Java: "bg-orange-500",
  "C++": "bg-pink-500",
  C: "bg-gray-500",
  Ruby: "bg-red-600",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-600",
  Dart: "bg-cyan-400",
  PHP: "bg-indigo-400",
  Shell: "bg-green-700",
  Zig: "bg-orange-400",
};

export function getLanguageColor(language?: string | null): string {
  return langColors[language ?? ""] ?? "bg-slate-400";
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

export function getBadge(stars: number, forks: number): { label: string; tone: string } {
  if (stars >= 100_000) return { label: "Trending", tone: "hot" };
  if (forks >= 10_000) return { label: "Launch", tone: "launch" };
  if (stars < 5_000) return { label: "New Star", tone: "new" };
  return { label: "Rising", tone: "rising" };
}

export const badgeStyles: Record<string, string> = {
  hot: "text-orange-600 bg-orange-500/10 border-orange-500/20 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20",
  launch: "text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20",
  new: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/20",
  rising: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20",
};

export function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function generateGradient(name: string): string {
  const h = hashString(name);
  const hue1 = h % 360;
  const hue2 = (h * 1.7) % 360;
  const hue3 = (h * 2.3) % 360;
  return `linear-gradient(135deg, hsl(${hue1} 70% 55%) 0%, hsl(${hue2} 70% 50%) 50%, hsl(${hue3} 70% 45%) 100%)`;
}

export function formatDate(value: any): string {
  if (!value) return "Just now";
  if (typeof value === "string" && Number.isNaN(Date.parse(value))) {
    return value;
  }
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(value);
  }
}

export function timeAgo(dateValue: any): string {
  if (!dateValue) return "recently";
  const now = Date.now();
  const date =
    typeof dateValue === "number" ? dateValue : new Date(dateValue).getTime();
  if (isNaN(date)) return "recently";
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
