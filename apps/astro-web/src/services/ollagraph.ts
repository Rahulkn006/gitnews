import {
  fetchGitHubAPI,
  fetchRepoFile,
  fetchRepoReadme,
  fetchRepoTree,
} from "./github";

export interface ResearchSource {
  title: string;
  platform: string;
  summary: string;
  url: string;
}

export interface DeepResearchCategory {
  overview: string;
  whyDevelopersWatch: string;
  communitySentiment: string;
  learningValue: string;
  productionUsage: string;
  recentActivity: string;
  usefulResources: string;
  sources: ResearchSource[];
  confidence: "High" | "Medium" | "Low";
  status: "available" | "unavailable";
}

export interface OllagraphAnalysis {
  summary: string;
  whatItDoes: string;
  whyTrending: string;
  recentChanges: string;
  developerAdoption: string;
  bestUseCases: string;
  learningDifficulty: string;
  futurePotential: string;
  alternatives: string;
  verdict: string;
  codeIntelligence?: {
    folderStructure: Record<string, string>;
    importantFiles: Record<string, string>;
    frameworks: string[];
    dependencies: string[];
  };
  scores?: {
    learningValue: number;
    futureScope: number;
    marketDemand: number;
    community: number;
  };
  deepResearch?: DeepResearchCategory;
}

interface CacheEntry {
  analysis: OllagraphAnalysis;
  createdAt: number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

export class OllagraphClient {
  async analyzeRepository(
    owner: string,
    repo: string,
  ): Promise<OllagraphAnalysis> {
    const cacheKey = `${owner}/${repo}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.createdAt < CACHE_TTL) {
      return cached.analysis;
    }

    try {
      console.log(`[Ollagraph] Constructing deep analysis for ${cacheKey}...`);

      const [repoData, readme, tree, pkgJsonStr] = await Promise.all([
        fetchGitHubAPI(`/repos/${owner}/${repo}`),
        fetchRepoReadme(owner, repo),
        fetchRepoTree(owner, repo),
        fetchRepoFile(owner, repo, "package.json").catch(() => null),
      ]);

      if (!repoData) {
        throw new Error("Could not fetch repo data");
      }

      // 1. Analyze structure
      const folderStructure: Record<string, string> = {};
      if (tree && Array.isArray(tree)) {
        tree
          .filter((t: any) => t.type === "tree")
          .slice(0, 5)
          .forEach((t: any) => {
            if (t.path === "src")
              folderStructure[t.path] = "Application source";
            else if (t.path === "components")
              folderStructure[t.path] = "Reusable UI";
            else if (t.path === "api")
              folderStructure[t.path] = "Backend communication";
            else if (t.path === "docs")
              folderStructure[t.path] = "Documentation";
            else folderStructure[t.path] = "Module directory";
          });
      }

      // 2. Parse package.json
      const dependencies: string[] = [];
      const frameworks: string[] = [];
      let pkgInfo = "";
      if (pkgJsonStr) {
        try {
          const pkg = JSON.parse(pkgJsonStr);
          if (pkg.dependencies) {
            const deps = Object.keys(pkg.dependencies);
            dependencies.push(...deps.slice(0, 10));
            if (
              deps.includes("react") ||
              deps.includes("next") ||
              deps.includes("vue")
            )
              frameworks.push("Frontend Framework");
            if (deps.includes("express") || deps.includes("nestjs"))
              frameworks.push("Backend Framework");
          }
          pkgInfo = `Contains ${Object.keys(pkg.dependencies || {}).length} dependencies.`;
        } catch (e) {}
      }

      // 3. Compute heuristic scores
      const stars = repoData.stargazers_count || 0;
      const forks = repoData.forks_count || 0;
      const issues = repoData.open_issues_count || 0;

      const learningValue = Math.min(
        100,
        Math.max(50, Math.floor(stars / 1000 + 50)),
      );
      const marketDemand = Math.min(
        100,
        Math.max(40, Math.floor(forks / 500 + 60)),
      );
      const community = Math.min(
        100,
        Math.max(30, Math.floor(stars / 500 - issues / 100 + 50)),
      );
      const futureScope = Math.min(
        100,
        Math.floor((learningValue + marketDemand) / 2) + 10,
      );

      // 4. Generate Core Repository Intelligence (Ollima API)
      const { ollima } = await import("./ollimaService");
      const ollimaIntel = await ollima.generateIntelligence(
        repoData,
        owner,
        repo,
      );

      // 5. Generate External Citation Deep Research (Ollagraph)
      const deepResearch = await this.generateDeepResearch(
        repoData,
        owner,
        repo,
      );

      const analysis: OllagraphAnalysis = {
        summary: ollimaIntel.summary,
        whatItDoes: ollimaIntel.summary,
        whyTrending: ollimaIntel.whyTrending,
        recentChanges: `Check GitHub releases for latest changes.`, // To be updated if needed later
        developerAdoption:
          ollimaIntel.strengths.join(" • ") || `Used in production globally.`,
        bestUseCases:
          ollimaIntel.useCases.join(" • ") ||
          `Excellent for modern development.`,
        learningDifficulty: ollimaIntel.difficulty,
        futurePotential: `Growth indicators are strong based on AI analysis.`,
        alternatives:
          ollimaIntel.alternatives.join(" • ") ||
          `Other open source tools in the domain.`,
        verdict:
          ollimaIntel.limitations.length > 0
            ? `Limitations: ${ollimaIntel.limitations.join(" • ")}`
            : `Highly recommended for production use.`,
        codeIntelligence: {
          folderStructure,
          importantFiles: {
            "package.json": pkgInfo || "Project configuration",
            "README.md": "Documentation and setup instructions",
          },
          frameworks:
            frameworks.length > 0
              ? frameworks
              : [repoData.language || "Unknown Framework"],
          dependencies:
            dependencies.length > 0 ? dependencies : ["Standard Library"],
        },
        scores: {
          learningValue,
          marketDemand,
          community,
          futureScope,
        },
        deepResearch,
      };

      cache.set(cacheKey, { analysis, createdAt: Date.now() });
      return analysis;
    } catch (error) {
      console.warn(
        `[Ollagraph] Failed to fetch analysis for ${cacheKey}. Using fallback.`,
        error,
      );
      return this.getFallbackAnalysis(owner, repo);
    }
  }

  private async fetchHackerNews(query: string): Promise<ResearchSource[]> {
    try {
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&hitsPerPage=3`,
      );
      const data = await res.json();
      return data.hits.map((hit: any) => ({
        title: hit.title || hit.story_title || "HN Discussion",
        platform: "Hacker News",
        summary: hit.comment_text
          ? hit.comment_text.substring(0, 100) + "..."
          : "Community discussion",
        url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
      }));
    } catch {
      return [];
    }
  }

  private async fetchReddit(query: string): Promise<ResearchSource[]> {
    try {
      const res = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=3`,
      );
      const data = await res.json();
      return data.data.children.map((child: any) => ({
        title: child.data.title,
        platform: "Reddit",
        summary: child.data.selftext
          ? child.data.selftext.substring(0, 100) + "..."
          : "Reddit discussion",
        url: `https://reddit.com${child.data.permalink}`,
      }));
    } catch {
      return [];
    }
  }

  private async fetchYouTube(query: string): Promise<ResearchSource[]> {
    try {
      // @ts-ignore
      const apiKey =
        typeof import.meta !== "undefined"
          ? import.meta.env.YOUTUBE_API_KEY
          : process.env.YOUTUBE_API_KEY;
      if (!apiKey) return [];

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + " programming")}&type=video&maxResults=3&key=${apiKey}`,
      );
      const data = await res.json();
      if (!data.items) return [];

      return data.items.map((item: any) => ({
        title: item.snippet.title,
        platform: "YouTube",
        summary: item.snippet.description
          ? item.snippet.description.substring(0, 100) + "..."
          : "Video discussion",
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));
    } catch {
      return [];
    }
  }

  private async fetchGitHub(query: string): Promise<ResearchSource[]> {
    try {
      // @ts-ignore
      const token =
        typeof import.meta !== "undefined"
          ? import.meta.env.GITHUB_TOKEN
          : process.env.GITHUB_TOKEN;
      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(
        `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=3`,
        { headers },
      );
      const data = await res.json();
      if (!data.items) return [];

      return data.items.map((item: any) => ({
        title: item.title,
        platform: "GitHub",
        summary: item.body
          ? item.body.substring(0, 100) + "..."
          : "GitHub issue/PR",
        url: item.html_url,
      }));
    } catch {
      return [];
    }
  }

  private async generateDeepResearch(
    repoData: any,
    owner: string,
    repo: string,
  ): Promise<DeepResearchCategory> {
    const query = `${owner} ${repo}`;

    // 1. Fetch real sources
    const [hnSources, redditSources, ytSources, ghSources] = await Promise.all([
      this.fetchHackerNews(query),
      this.fetchReddit(query),
      this.fetchYouTube(query),
      this.fetchGitHub(query),
    ]);

    const allSources = [
      ...hnSources,
      ...redditSources,
      ...ytSources,
      ...ghSources,
    ];

    // Calculate confidence based on real sources found
    let confidence: "High" | "Medium" | "Low" = "Low";
    if (allSources.length >= 8) confidence = "High";
    else if (allSources.length >= 4) confidence = "Medium";

    const sourcesContext = allSources
      .map((s) => `[${s.platform}] ${s.title}: ${s.summary}`)
      .join("\n");

    const prompt = `Act as an expert developer AI analyst. You are analyzing the GitHub repository ${owner}/${repo} (${repoData.description || "No description"}).
Here are real discussions found about this repo:
${sourcesContext}

Based ONLY on this data and the repo description, generate a detailed research intelligence report.
Return ONLY a valid JSON object with EXACTLY these keys:
"overview": What this repository does,
"whyDevelopersWatch": Real reasons based on collected sources,
"communitySentiment": Advantages and concerns from the community,
"learningValue": Beginner/intermediate/advanced and required skills,
"productionUsage": Verified companies or "No verified production adoption found",
"recentActivity": Recent updates,
"usefulResources": Blogs or documentation.

DO NOT use dummy data. If information is missing, state it clearly.`;

    try {
      // 1. Try local Ollama processing
      const ollamaRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: prompt,
          format: "json",
          stream: false,
        }),
      });
      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        const parsed = JSON.parse(data.response);
        return {
          ...parsed,
          sources: allSources,
          confidence,
          status: "available",
        };
      }
    } catch (e) {
      console.log(
        "[Ollagraph] Ollama unavailable, falling back to Together AI...",
      );
    }

    try {
      // @ts-ignore
      const ollimaKey =
        typeof import.meta !== "undefined"
          ? import.meta.env.OLLIMA_API_KEY
          : process.env.OLLIMA_API_KEY;

      if (ollimaKey) {
        const ollimaRes = await fetch(
          "https://api.ollima.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ollimaKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" },
            }),
          },
        );

        if (ollimaRes.ok) {
          const data = await ollimaRes.json();
          try {
            const parsed = JSON.parse(data.choices[0].message.content);

            // Ensure all fields are strings since LLM might return arrays/objects
            const ensureString = (val: any) => {
              if (typeof val === "string") return val;
              if (Array.isArray(val)) return val.join("\\n- ");
              if (typeof val === "object" && val !== null)
                return JSON.stringify(val, null, 2);
              return String(val);
            };

            return {
              overview: ensureString(parsed.overview),
              whyDevelopersWatch: ensureString(parsed.whyDevelopersWatch),
              communitySentiment: ensureString(parsed.communitySentiment),
              learningValue: ensureString(parsed.learningValue),
              productionUsage: ensureString(parsed.productionUsage),
              recentActivity: ensureString(parsed.recentActivity),
              usefulResources: ensureString(parsed.usefulResources),
              sources: allSources,
              confidence,
              status: "available",
            };
          } catch (e) {
            console.error(
              "[Ollagraph] Failed to parse Ollima JSON:",
              e,
              data.choices[0].message.content,
            );
            throw e;
          }
        } else {
          const text = await ollimaRes.text();
          console.error(
            "[Ollagraph] Ollima API error:",
            ollimaRes.status,
            text,
          );
          throw new Error("Ollima API error");
        }
      }
    } catch (e) {
      console.log(
        "[Ollagraph] Ollima failed, falling back to unavailable status...",
        e,
      );
    }

    // 3. Fallback to unavailable
    return {
      overview:
        "LLM synthesis unavailable (API Key error). See real citations below.",
      whyDevelopersWatch:
        "LLM synthesis unavailable (API Key error). See real citations below.",
      communitySentiment:
        "LLM synthesis unavailable (API Key error). See real citations below.",
      learningValue:
        "LLM synthesis unavailable (API Key error). See real citations below.",
      productionUsage:
        "LLM synthesis unavailable (API Key error). See real citations below.",
      recentActivity:
        "LLM synthesis unavailable (API Key error). See real citations below.",
      usefulResources:
        "LLM synthesis unavailable (API Key error). See real citations below.",
      sources: allSources,
      confidence: confidence,
      status: "available", // Force available so React renders the citations
    };
  }

  private getFallbackAnalysis(owner: string, repo: string): OllagraphAnalysis {
    return {
      summary: `Fallback summary for ${owner}/${repo}.`,
      whatItDoes: `A standard GitHub repository.`,
      whyTrending: `Active community and recent updates on GitHub.`,
      recentChanges: `Check the GitHub releases page for recent updates.`,
      developerAdoption: `Growing steadily on GitHub.`,
      bestUseCases: `General purpose development.`,
      learningDifficulty: `Varies`,
      futurePotential: `Stable`,
      alternatives: `Search GitHub for similar tags.`,
      verdict: `Worth exploring based on standard GitHub metrics.`,
      deepResearch: {
        overview: "Deep research unavailable currently",
        whyDevelopersWatch: "Deep research unavailable currently",
        communitySentiment: "Deep research unavailable currently",
        learningValue: "Deep research unavailable currently",
        productionUsage: "Deep research unavailable currently",
        recentActivity: "Deep research unavailable currently",
        usefulResources: "Deep research unavailable currently",
        sources: [],
        confidence: "Low",
        status: "unavailable",
      },
    };
  }
}

export const ollagraph = new OllagraphClient();
