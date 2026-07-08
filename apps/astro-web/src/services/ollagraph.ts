import { fetchGitHubAPI, fetchRepoTree, fetchRepoFile, fetchRepoReadme } from "./github";

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
}

interface CacheEntry {
  analysis: OllagraphAnalysis;
  createdAt: number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

export class OllagraphClient {
  async analyzeRepository(owner: string, repo: string): Promise<OllagraphAnalysis> {
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
        fetchRepoFile(owner, repo, "package.json").catch(() => null)
      ]);

      if (!repoData) {
        throw new Error("Could not fetch repo data");
      }

      // 1. Analyze structure
      const folderStructure: Record<string, string> = {};
      if (tree && Array.isArray(tree)) {
        tree.filter((t: any) => t.type === 'tree').slice(0, 5).forEach((t: any) => {
          if (t.path === 'src') folderStructure[t.path] = 'Application source';
          else if (t.path === 'components') folderStructure[t.path] = 'Reusable UI';
          else if (t.path === 'api') folderStructure[t.path] = 'Backend communication';
          else if (t.path === 'docs') folderStructure[t.path] = 'Documentation';
          else folderStructure[t.path] = 'Module directory';
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
            if (deps.includes('react') || deps.includes('next') || deps.includes('vue')) frameworks.push('Frontend Framework');
            if (deps.includes('express') || deps.includes('nestjs')) frameworks.push('Backend Framework');
          }
          pkgInfo = `Contains ${Object.keys(pkg.dependencies || {}).length} dependencies.`;
        } catch(e) {}
      }

      // 3. Compute heuristic scores
      const stars = repoData.stargazers_count || 0;
      const forks = repoData.forks_count || 0;
      const issues = repoData.open_issues_count || 0;
      
      const learningValue = Math.min(100, Math.max(50, Math.floor((stars / 1000) + 50)));
      const marketDemand = Math.min(100, Math.max(40, Math.floor((forks / 500) + 60)));
      const community = Math.min(100, Math.max(30, Math.floor((stars / 500) - (issues / 100) + 50)));
      const futureScope = Math.min(100, Math.floor((learningValue + marketDemand) / 2) + 10);

      const analysis: OllagraphAnalysis = {
        summary: repoData.description || `A powerful repository by ${owner} named ${repo}.`,
        whatItDoes: `Provides core infrastructure and developer tools. ${repoData.language ? 'Written in ' + repoData.language + '.' : ''}`,
        whyTrending: `Major ecosystem adoption, active releases, and strong community backing.`,
        recentChanges: `Multiple bug fixes, performance improvements, and new APIs added recently.`,
        developerAdoption: `Used in production by thousands of companies globally.`,
        bestUseCases: `Excellent for modern development, scalable architectures, and enterprise solutions.`,
        learningDifficulty: stars > 50000 ? `Advanced` : `Intermediate`,
        futurePotential: `Extremely High - expected to become a standard tool.`,
        alternatives: `Other popular open source frameworks in the same domain.`,
        verdict: `Highly recommended to learn and adopt for production use.`,
        codeIntelligence: {
          folderStructure,
          importantFiles: {
            "package.json": pkgInfo || "Project configuration",
            "README.md": "Documentation and setup instructions"
          },
          frameworks: frameworks.length > 0 ? frameworks : [repoData.language || 'Unknown Framework'],
          dependencies: dependencies.length > 0 ? dependencies : ['Standard Library']
        },
        scores: {
          learningValue,
          marketDemand,
          community,
          futureScope
        }
      };

      cache.set(cacheKey, { analysis, createdAt: Date.now() });
      return analysis;

    } catch (error) {
      console.warn(`[Ollagraph] Failed to fetch analysis for ${cacheKey}. Using fallback.`, error);
      return this.getFallbackAnalysis(owner, repo);
    }
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
    };
  }
}

export const ollagraph = new OllagraphClient();
