import { withConvex } from "@/lib/convex";
import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";

function CompanyDetailComponent({ companyName }: { companyName: string }) {
  const details = useQuery(api.companies.getCompanyDetails, {
    owner: companyName,
  });

  if (details === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mb-6"></div>
        <p className="font-mono text-sm animate-pulse text-muted-foreground">
          Generating engineering report for {companyName}...
        </p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-serif font-bold">Company Not Found</h2>
        <p className="text-muted-foreground mt-2">
          Could not find engineering data for {companyName}.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-700 space-y-16">
      {/* HEADER */}
      <div className="text-center">
        {details.avatar && (
          <img
            src={details.avatar}
            alt={details.name}
            className="w-24 h-24 rounded-2xl mx-auto mb-6 shadow-xl border border-border"
          />
        )}
        <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest block mb-3">
          Engineering Report
        </span>
        <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tight text-foreground uppercase">
          {details.name}
        </h1>
      </div>

      {/* 1. ENGINEERING OVERVIEW */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-950 dark:from-stone-900 dark:to-black border border-stone-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-x divide-stone-800">
          <div className="col-span-2 md:col-span-1 border-0">
            <div className="text-5xl font-black font-serif text-white tracking-tighter mb-2">
              {details.overview.score}
              <span className="text-xl text-stone-500">/100</span>
            </div>
            <div className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest">
              Engineering Score
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-serif text-white mb-2">
              {(details.overview.totalStars / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              Total Stars
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-serif text-white mb-2">
              {(details.overview.totalForks / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              Total Forks
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-serif text-white mb-2">
              {details.overview.totalRepos}
            </div>
            <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              Repositories
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-serif text-emerald-400 mb-2">
              {details.overview.activeProjects}
            </div>
            <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              Active Projects
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEVELOPER INTELLIGENCE (Moved up for impact) */}
      <section className="bg-card border border-border rounded-xl p-8 text-center max-w-4xl mx-auto shadow-sm">
        <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest block mb-4">
          Why Developers Follow This Company
        </span>
        <p className="text-lg md:text-xl font-serif leading-relaxed text-foreground italic">
          "{details.developerInsight}"
        </p>
      </section>

      {/* 2. ENGINEERING DNA */}
      <section>
        <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-8">
          Engineering DNA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {details.dna.map((category) => (
            <div
              key={category.category}
              className="bg-card border border-border rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-bold mb-4">
                {category.category}
              </h3>
              <ul className="space-y-3">
                {category.repos.map((repo: any) => (
                  <li
                    key={repo.name}
                    className="flex items-center justify-between group"
                  >
                    <a
                      href={repo.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold font-serif text-foreground group-hover:text-emerald-500 transition-colors truncate pr-4"
                    >
                      {repo.name}
                    </a>
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      ⭐{" "}
                      {repo.stars > 1000
                        ? (repo.stars / 1000).toFixed(1) + "k"
                        : repo.stars}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TECHNOLOGY DISTRIBUTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-6">
            Language Distribution
          </h2>
          <div className="space-y-4">
            {details.techDistribution.languages.map((lang, index) => {
              const max = details.techDistribution.languages[0].value;
              const percent = Math.max(5, Math.round((lang.value / max) * 100));
              return (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold">{lang.name}</span>
                    <span className="text-muted-foreground">
                      {lang.value} repos
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-6">
            Domain Focus
          </h2>
          <div className="flex flex-wrap gap-2">
            {details.techDistribution.topics.map((topic) => (
              <span
                key={topic.name}
                className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm font-mono flex items-center gap-2"
              >
                <span className="font-bold text-foreground">{topic.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {topic.value}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TOP REPOSITORY PORTFOLIO */}
      <section>
        <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-8">
          Top Repository Portfolio
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {details.topRepos.map((repo: any, index: number) => (
            <a
              key={repo.name}
              href={repo.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-card border border-border rounded-xl hover:border-emerald-500/50 hover:shadow-lg transition-all group gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center text-sm font-mono font-bold text-stone-300 dark:text-stone-700">
                  #{index + 1}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg group-hover:text-emerald-500 transition-colors">
                    {repo.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl mt-1">
                    {repo.description || "No description provided."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-center">
                  <div className="text-sm font-bold font-mono">
                    ⭐ {repo.stars?.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                    Stars
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    +{repo.growth7d || 0}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                    7d Growth
                  </div>
                </div>
                <div className="text-center hidden md:block w-24">
                  <div className="text-sm font-bold font-mono truncate">
                    {repo.language || "N/A"}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                    Language
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export const CompanyDetail = withConvex(CompanyDetailComponent);
