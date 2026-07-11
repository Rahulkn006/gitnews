import useSWR from "swr";
import { fetcher } from "@/lib/api";

function CompanyGalleryComponent() {
  const { data: companies, isLoading } = useSWR("/api/companies", fetcher);

  if (isLoading || !companies) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mb-6"></div>
        <p className="font-mono text-sm animate-pulse text-muted-foreground">
          Aggregating company intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company: any) => (
        <a
          key={company.id}
          href={`/olla/company-index/${company.name.toLowerCase()}`}
          className="group relative block bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden"
        >
          {/* Soft background glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-colors duration-500 rounded-xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              {company.avatar ? (
                <img
                  src={company.avatar}
                  alt={company.name}
                  className="w-12 h-12 rounded-xl border border-border shadow-sm group-hover:border-emerald-500/50 transition-colors shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-serif font-black text-xl text-stone-500 shrink-0">
                  {company.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {company.name}
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono font-bold uppercase tracking-wider shrink-0">
                    {company.category}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">
                  Score: {company.engineeringScore}/100
                </div>
              </div>
            </div>

            <p className="text-sm font-serif text-muted-foreground mb-4 line-clamp-2 h-10 italic">
              "{company.summary}"
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                  Total Stars
                </div>
                <div className="font-bold text-foreground text-sm flex gap-3">
                  <span>
                    ⭐{" "}
                    {company.totalStars > 1000
                      ? (company.totalStars / 1000).toFixed(1) + "k"
                      : company.totalStars}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                  Main Areas
                </div>
                <div className="flex flex-wrap gap-1">
                  {company.primaryAreas.length > 0 ? (
                    company.primaryAreas.slice(0, 2).map((area: string) => (
                      <span
                        key={area}
                        className="text-[9px] px-1.5 py-0.5 bg-muted rounded-md text-foreground font-mono truncate max-w-full"
                      >
                        {area}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 bg-muted rounded-md text-muted-foreground font-mono">
                      Mixed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Hover Reveal Details */}
            <div className="mt-4 pt-4 border-t border-border/50 grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <div className="overflow-hidden space-y-4">
                <div>
                  <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                    Main Languages
                  </div>
                  <div className="flex gap-2">
                    {company.mainLanguages &&
                    company.mainLanguages.length > 0 ? (
                      company.mainLanguages.map((l: string) => (
                        <span
                          key={l}
                          className="text-xs font-bold text-foreground"
                        >
                          {l}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-bold text-foreground">
                        N/A
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                    Top Repositories
                  </div>
                  <ul className="space-y-1">
                    {company.topProjects &&
                      company.topProjects.map((p: string, i: number) => (
                        <li
                          key={p}
                          className="text-xs font-mono text-emerald-600 dark:text-emerald-400 truncate"
                        >
                          {i + 1}. <span className="text-foreground">{p}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              View Engineering Report <span>→</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export const CompanyGallery = CompanyGalleryComponent;
