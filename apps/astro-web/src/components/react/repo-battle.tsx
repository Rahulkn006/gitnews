import { useState, useRef, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@v1/backend/convex/_generated/api";
import { withConvex } from "@/lib/convex";
import { BackNavigation } from "./back-navigation";

function RepoAutocomplete({ 
  label, 
  value, 
  onChange, 
  repos 
}: { 
  label: string; 
  value: any; 
  onChange: (repo: any) => void; 
  repos: any[];
}) {
  const [query, setQuery] = useState(value ? `${value.owner}/${value.name}` : "");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setQuery(`${value.owner}/${value.name}`);
    } else {
      setQuery("");
    }
  }, [value]);

  const filtered = query 
    ? repos.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) || 
        r.owner.toLowerCase().includes(query.toLowerCase()) ||
        `${r.owner}/${r.name}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : repos.slice(0, 5);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">
        {label}
      </label>
      <input
        type="text"
        placeholder="e.g. vercel/next.js"
        className="w-full bg-card border border-border hover:border-primary/50 focus:border-primary rounded-lg py-3 px-4 text-sm font-mono focus:outline-none transition-colors"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filtered.map(repo => (
            <div 
              key={repo._id || repo.id}
              className="p-3 hover:bg-muted cursor-pointer flex items-center gap-3 border-b border-border/50 last:border-0"
              onClick={() => {
                onChange(repo);
                setIsOpen(false);
              }}
            >
              {repo.avatar ? (
                <img src={repo.avatar} alt={repo.owner} className="w-6 h-6 rounded-md" />
              ) : (
                <div className="w-6 h-6 rounded-md bg-stone-200 dark:bg-stone-800" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-mono text-foreground font-bold">{repo.owner}/{repo.name}</span>
                <span className="text-xs text-muted-foreground flex gap-2">
                  <span>⭐ {repo.stars}</span>
                  {repo.language && <span>• {repo.language}</span>}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const RepoBattleComponent = () => {
  const [repoA, setRepoA] = useState<any>(null);
  const [repoB, setRepoB] = useState<any>(null);
  
  const [isBattling, setIsBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const dbRepos = useQuery(api.github.getAllRepos) || [];
  const compareRepositories = useAction(api.battle.compareRepositories);

  const handleQuickCompare = (ownerA: string, nameA: string, ownerB: string, nameB: string) => {
    const rA = dbRepos.find(r => r.owner.toLowerCase() === ownerA.toLowerCase() && r.name.toLowerCase() === nameA.toLowerCase());
    const rB = dbRepos.find(r => r.owner.toLowerCase() === ownerB.toLowerCase() && r.name.toLowerCase() === nameB.toLowerCase());
    
    if (rA) setRepoA(rA);
    if (rB) setRepoB(rB);
  };

  const runBattle = async () => {
    if (!repoA || !repoB) {
      setError("Please select both repositories to compare.");
      return;
    }
    
    setIsBattling(true);
    setError(null);
    setBattleResult(null);
    
    try {
      const result = await compareRepositories({ 
        repoAId: repoA._id, 
        repoBId: repoB._id 
      });
      setBattleResult(result);
    } catch (e: any) {
      setError(e.message || "Failed to analyze battle. Insufficient data or AI error.");
    } finally {
      setIsBattling(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-8">
        <BackNavigation />
      </div>
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest block mb-2">
          Olla AI Intelligence
        </span>
        <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight mb-4">
          Repo Battle
        </h1>
        <p className="text-muted-foreground text-sm font-mono">
          Compare open-source projects using deep developer intelligence and AI synthesis.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-12 shadow-sm relative overflow-visible">
        <div className="flex flex-col md:flex-row items-center gap-6 z-10 relative">
          <RepoAutocomplete label="Repository A" value={repoA} onChange={setRepoA} repos={dbRepos} />
          
          <div className="flex-shrink-0 mt-4 md:mt-0 font-black font-serif italic text-2xl text-stone-300 dark:text-stone-700">
            VS
          </div>
          
          <RepoAutocomplete label="Repository B" value={repoB} onChange={setRepoB} repos={dbRepos} />
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-border/50 pt-8">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs font-mono text-muted-foreground mr-2 self-center">Quick Compare:</span>
            <button onClick={() => handleQuickCompare("facebook", "react", "vuejs", "vue")} className="text-[10px] px-2 py-1 bg-muted rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition font-mono border border-border">React vs Vue</button>
            <button onClick={() => handleQuickCompare("vercel", "next.js", "nuxt", "nuxt")} className="text-[10px] px-2 py-1 bg-muted rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition font-mono border border-border">Next vs Nuxt</button>
            <button onClick={() => handleQuickCompare("docker", "docker", "containers", "podman")} className="text-[10px] px-2 py-1 bg-muted rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition font-mono border border-border">Docker vs Podman</button>
          </div>
          
          <button 
            onClick={runBattle}
            disabled={isBattling || !repoA || !repoB}
            className="mt-4 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold font-mono rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            {isBattling ? "Analyzing Battle..." : "Analyze Battle ⚔️"}
          </button>
          
          {error && <p className="text-red-500 font-mono text-xs mt-2">{error}</p>}
        </div>
      </div>

      {isBattling && (
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mb-6"></div>
          <p className="font-mono text-sm animate-pulse text-muted-foreground">Olla AI is analyzing GitHub metrics, growth velocity, and community discussions...</p>
        </div>
      )}

      {battleResult && !isBattling && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
          
          {/* 1. VERDICT CARD */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 dark:from-stone-900 dark:to-black border border-stone-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full"></div>
            <div className="flex flex-col items-center text-center relative z-10">
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 font-bold">WINNER</span>
              <h2 className="text-5xl md:text-6xl font-black font-serif text-slate-900 dark:text-white flex items-center justify-center gap-3 drop-shadow-sm">
                {battleResult.synthesis.winner} <span className="text-4xl drop-shadow-md">🏆</span>
              </h2>
            </div>
          </div>

          {/* 2. AI VERDICT */}
          <div className="bg-card border border-border rounded-xl p-8 text-center max-w-4xl mx-auto">
            <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest block mb-4">Developer Verdict</span>
            <p className="text-lg md:text-xl font-serif leading-relaxed text-foreground italic">
              "{battleResult.synthesis.developerVerdict}"
            </p>
          </div>

          {/* 3. WHY IT WON */}
          <div className="max-w-3xl mx-auto">
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-6">Winning Reasons</h3>
            <div className="grid gap-3">
              {battleResult.synthesis.winningReasons.map((reason: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span className="text-sm font-mono text-foreground">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. STRENGTH VS WEAKNESS */}
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-6">Strengths & Weaknesses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="text-xl font-bold font-serif mb-6 text-foreground">{battleResult.repoA.name}</h4>
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest block mb-3">Strengths</span>
                    <ul className="space-y-2">
                      {battleResult.synthesis.strengthsA.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-mono"><span className="text-emerald-500">✅</span> {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block mb-3">Weaknesses</span>
                    <ul className="space-y-2">
                      {battleResult.synthesis.weaknessesA.map((w: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-mono"><span className="text-red-400">⚠</span> {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="text-xl font-bold font-serif mb-6 text-foreground">{battleResult.repoB.name}</h4>
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest block mb-3">Strengths</span>
                    <ul className="space-y-2">
                      {battleResult.synthesis.strengthsB.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-mono"><span className="text-emerald-500">✅</span> {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block mb-3">Weaknesses</span>
                    <ul className="space-y-2">
                      {battleResult.synthesis.weaknessesB.map((w: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-mono"><span className="text-red-400">⚠</span> {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 5. USE CASE RECOMMENDATION */}
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-6">Developer Decision Panel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                <h4 className="text-sm font-bold font-mono text-foreground mb-4">Choose {battleResult.repoA.name} if you need:</h4>
                <ul className="space-y-3">
                  {battleResult.synthesis.useCasesA.map((uc: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-serif">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                <h4 className="text-sm font-bold font-mono text-foreground mb-4">Choose {battleResult.repoB.name} if you need:</h4>
                <ul className="space-y-3">
                  {battleResult.synthesis.useCasesB.map((uc: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-serif">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 6. SCORES */}
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-6">Learning & Battle Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold font-serif text-lg">{battleResult.repoA.name}</span>
                  <div className="text-3xl font-black font-serif text-emerald-600 dark:text-emerald-400">{battleResult.repoA.finalScore}<span className="text-sm text-muted-foreground">/100</span></div>
                </div>
                <ScoreBar label="Beginner Friendly" score={battleResult.synthesis.learningScoresA.beginnerFriendly} />
                <ScoreBar label="Documentation" score={battleResult.synthesis.learningScoresA.documentation} />
                <ScoreBar label="Job Demand" score={battleResult.synthesis.learningScoresA.jobDemand} />
                <ScoreBar label="Future Potential" score={battleResult.synthesis.learningScoresA.futurePotential} />
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold font-serif text-lg">{battleResult.repoB.name}</span>
                  <div className="text-3xl font-black font-serif text-emerald-600 dark:text-emerald-400">{battleResult.repoB.finalScore}<span className="text-sm text-muted-foreground">/100</span></div>
                </div>
                <ScoreBar label="Beginner Friendly" score={battleResult.synthesis.learningScoresB.beginnerFriendly} />
                <ScoreBar label="Documentation" score={battleResult.synthesis.learningScoresB.documentation} />
                <ScoreBar label="Job Demand" score={battleResult.synthesis.learningScoresB.jobDemand} />
                <ScoreBar label="Future Potential" score={battleResult.synthesis.learningScoresB.futurePotential} />
              </div>
            </div>
          </div>

          {/* 7. RAW METRICS TABLE */}
          <div className="pt-8">
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-6">Raw Activity Metrics</h3>
            <div className="space-y-4">
              <MetricRow title="Total Stars" repoA={battleResult.repoA.name} repoB={battleResult.repoB.name} a={battleResult.repoA.stars?.toLocaleString()} b={battleResult.repoB.stars?.toLocaleString()} />
              <MetricRow title="Total Forks" repoA={battleResult.repoA.name} repoB={battleResult.repoB.name} a={battleResult.repoA.forks?.toLocaleString()} b={battleResult.repoB.forks?.toLocaleString()} />
              <MetricRow title="Open Issues" repoA={battleResult.repoA.name} repoB={battleResult.repoB.name} a={battleResult.repoA.githubData?.open_issues_count?.toLocaleString() || 'N/A'} b={battleResult.repoB.githubData?.open_issues_count?.toLocaleString() || 'N/A'} />
              <MetricRow title="Last Pushed" repoA={battleResult.repoA.name} repoB={battleResult.repoB.name} a={battleResult.repoA.githubData?.pushed_at ? new Date(battleResult.repoA.githubData.pushed_at).toLocaleDateString() : 'N/A'} b={battleResult.repoB.githubData?.pushed_at ? new Date(battleResult.repoB.githubData.pushed_at).toLocaleDateString() : 'N/A'} />
              <MetricRow title="7d Growth" repoA={battleResult.repoA.name} repoB={battleResult.repoB.name} a={`+${battleResult.repoA.growth7d || 0}`} b={`+${battleResult.repoB.growth7d || 0}`} />
              <MetricRow title="Language" repoA={battleResult.repoA.name} repoB={battleResult.repoB.name} a={battleResult.repoA.language || 'N/A'} b={battleResult.repoB.language || 'N/A'} />
            </div>
          </div>
          
        </div>
      )}
    </main>
  );
};

function ScoreBar({ label, score }: { label: string, score: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-mono mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{score}/100</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}

function MetricRow({ title, repoA, repoB, a, b }: { title: string, repoA: string, repoB: string, a: string, b: string }) {
  return (
    <div className="flex flex-col items-center bg-card border border-border rounded-lg p-4 text-sm font-mono">
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-4">{title}</div>
      <div className="w-full flex justify-between items-center px-4">
        <div className="flex flex-col items-start w-1/2">
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mb-1 truncate max-w-[120px]" title={repoA}>{repoA}</div>
          <div className="font-bold text-foreground text-lg break-all">{a}</div>
        </div>
        <div className="flex flex-col items-end w-1/2">
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mb-1 truncate max-w-[120px]" title={repoB}>{repoB}</div>
          <div className="font-bold text-foreground text-lg break-all">{b}</div>
        </div>
      </div>
    </div>
  );
}

export const RepoBattle = withConvex(RepoBattleComponent);
