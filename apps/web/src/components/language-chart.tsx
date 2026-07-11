"use client";

interface LanguageChartProps {
  languages: [string, number][];
}

const langColors: Record<string, string> = {
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
  Ruby: "bg-red-600",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-600",
  Dart: "bg-cyan-400",
  PHP: "bg-indigo-400",
  Shell: "bg-green-700",
  Zig: "bg-orange-400",
};

function getLanguageColor(language: string) {
  return langColors[language] ?? "bg-[hsl(var(--muted-foreground))]";
}

export function LanguageChart({ languages }: LanguageChartProps) {
  if (languages.length === 0) {
    return (
      <div className="border border-dashed border-border p-4 text-center font-mono text-[10px] text-muted-foreground">
        No language data available
      </div>
    );
  }

  const total = languages.reduce((sum, [, count]) => sum + count, 0);
  const max = Math.max(...languages.map(([, count]) => count));

  return (
    <div>
      <h3 className="mb-3 border-b border-rule pb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Languages Audited
      </h3>
      <div className="flex flex-col gap-2.5">
        {languages.map(([lang, count]) => (
          <div key={lang} className="group flex items-center gap-3">
            <div className="flex w-20 items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${getLanguageColor(lang)}`}
              />
              <span className="truncate font-mono text-[10px] text-foreground">
                {lang}
              </span>
            </div>
            <div className="flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${getLanguageColor(lang)} transition-all duration-500`}
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
            <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
              {count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-rule pt-2 text-right font-mono text-[10px] text-muted-foreground">
        Total: {total} repos
      </div>
    </div>
  );
}
