"use client";

import Link from "next/link";

export function Hero() {
  const stats = [
    { label: "Trending Repos", value: "2,847", growth: "+14.2%" },
    { label: "AI Projects Tracked", value: "1,293", growth: "+22.5%" },
    { label: "Developer Tools", value: "856", growth: "+8.9%" },
    { label: "Daily Updates", value: "142", growth: "Active" },
  ];

  return (
    <section className="relative overflow-hidden py-20 border-b border-[#222]/80">
      {/* Background grids and shapes */}
      <div className="absolute -top-[118px] inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4.5rem_2rem] -z-10 [transform:perspective(1000px)_rotateX(-63deg)] h-[90%] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono mb-6 animate-pulse">
          <span>📡 GitNews Engine v1.0 Launched</span>
        </div>

        {/* Heading */}
        <h1 className="font-departure text-3xl md:text-6xl max-w-4xl mx-auto leading-tight mb-6">
          Discover the Future of <br />
          <span className="text-emerald-400">Open Source Intelligence</span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-8 font-sans">
          Track trending repositories, AI breakthroughs, developer tools and
          technology updates powered by intelligent discovery.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/trending"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-400 text-black hover:bg-emerald-300 font-mono text-xs font-bold transition-all text-center shadow-lg shadow-emerald-500/10"
          >
            Explore Trending Repos
          </Link>
          <Link
            href="/ai"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#111] text-foreground hover:bg-[#181818] border border-[#222] font-mono text-xs font-medium transition-all text-center"
          >
            Latest AI Updates
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#111]/40 backdrop-blur-sm border border-[#222]/80 rounded-xl p-5 text-left hover:border-emerald-500/30 transition-all group"
            >
              <span className="text-[10px] font-mono text-[#666] uppercase tracking-wider block mb-2">
                {stat.label}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight group-hover:text-emerald-400 transition-colors">
                  {stat.value}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    stat.growth.startsWith("+")
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  {stat.growth}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
