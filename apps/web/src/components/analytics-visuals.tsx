import React from "react";

// Helper to generate a deterministic pseudo-random number based on a string seed
function seedRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = Math.imul(741103597, h);
    return (h >>> 0) / 4294967296;
  };
}

export function MiniStarGraph({
  seed,
  color = "#10b981",
}: { seed: string; color?: string }) {
  const rand = seedRandom(seed);
  const points = [];
  let y = 50;

  // Generate random upward trending line
  for (let x = 0; x <= 100; x += 10) {
    y = Math.max(10, Math.min(90, y + (rand() * 20 - 5)));
    points.push(`${x},${100 - y}`);
  }

  return (
    <div className="w-full h-12 relative flex items-end">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        {/* Gradient fill */}
        <defs>
          <linearGradient id={`grad-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,100 ${points.join(" ")} 100,100`}
          fill={`url(#grad-${seed})`}
        />
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
}

export function ContributionHeatmap({ seed }: { seed: string }) {
  const rand = seedRandom(seed + "heat");
  const weeks = 8;
  const days = 7;

  return (
    <div className="flex gap-1 items-end w-max">
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-1">
          {Array.from({ length: days }).map((_, d) => {
            const intensity = rand();
            const opacity =
              intensity > 0.7
                ? 1
                : intensity > 0.4
                  ? 0.6
                  : intensity > 0.1
                    ? 0.3
                    : 0.05;
            return (
              <div
                key={d}
                className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500"
                style={{ opacity }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function LanguageBar({
  languages,
}: { languages: { name: string; percent: number; color: string }[] }) {
  return (
    <div className="w-full flex h-2 rounded-full overflow-hidden bg-stone-100 dark:bg-stone-800">
      {languages.map((lang) => (
        <div
          key={lang.name}
          style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
          className="h-full"
          title={`${lang.name}: ${lang.percent}%`}
        />
      ))}
    </div>
  );
}
