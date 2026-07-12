import { AnalysisDatabase } from "../database/analysis.database";
import prisma from "../database/prisma";
import { RepositoryDatabase } from "../database/repository.database";
import { TogetherService } from "./together.service";

const GITHUB_API_BASE = "https://api.github.com";
const DEFAULT_CATEGORY = "Tools";
const CATEGORY_ORDER = [
  "AI",
  "Web Development",
  "Mobile",
  "DevOps",
  "Data Science",
  "Tools",
];

type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url?: string;
  };
  description?: string | null;
  stargazers_count: number;
  forks_count: number;
  language?: string | null;
  topics?: string[];
  html_url: string;
  created_at: string;
  updated_at: string;
  readme?: string;
};

type GitHubSearchResponse = {
  items?: GitHubRepository[];
};

export class GitHubService {
  static async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "gitnews-backend",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    });

    if (!response.ok) {
      await response.text().catch(() => {});
      throw new Error(
        `GitHub API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json() as Promise<T>;
  }
  
  static async fetchGitHubAPI(endpoint: string): Promise<any> {
    try {
      const data = await this.fetchJson<any>(`${GITHUB_API_BASE}${endpoint}`);
      return data;
    } catch (e) {
      console.error(`fetchGitHubAPI failed for ${endpoint}:`, e);
      return null;
    }
  }

  static async fetchReadme(
    owner: string,
    name: string,
  ): Promise<string | undefined> {
    try {
      const readme = await this.fetchJson<{ content?: string }>(
        `${GITHUB_API_BASE}/repos/${owner}/${name}/readme`,
      );
      if (!readme?.content) return undefined;
      return Buffer.from(readme.content, "base64").toString("utf-8");
    } catch {
      return undefined;
    }
  }

  static async fetchRepoTree(owner: string, repo: string): Promise<any> {
    const branchData = await this.fetchGitHubAPI(`/repos/${owner}/${repo}`);
    if (!branchData) return null;
    const defaultBranch = branchData.default_branch || "main";
    const treeData = await this.fetchGitHubAPI(
      `/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`
    );
    return treeData?.tree || [];
  }

  static async fetchRepoFile(owner: string, repo: string, path: string): Promise<string | null> {
    const fileData = await this.fetchGitHubAPI(`/repos/${owner}/${repo}/contents/${path}`);
    if (fileData && fileData.content) {
      return Buffer.from(fileData.content, "base64").toString("utf8");
    }
    return null;
  }

  static async fetchReposByEndpoint(
    endpoint: string,
  ): Promise<GitHubRepository[]> {
    const data = await this.fetchJson<
      GitHubRepository[] | GitHubSearchResponse
    >(`${GITHUB_API_BASE}${endpoint}`);

    if (endpoint.includes("/search/repositories")) {
      return (data as GitHubSearchResponse).items ?? [];
    }

    return Array.isArray(data) ? data : [];
  }

  static async syncGitHubData() {
    console.log("Starting GitHub Sync...");
    const [latest, trending, updated, starred] = await Promise.all([
      this.fetchReposByEndpoint(
        "/search/repositories?q=stars:>10&sort=updated&order=desc&per_page=20",
      ),
      this.fetchReposByEndpoint(
        "/search/repositories?q=stars:>100&sort=stars&order=desc&per_page=20",
      ),
      this.fetchReposByEndpoint(
        "/search/repositories?q=stars:>10&sort=updated&order=desc&per_page=20",
      ),
      this.fetchReposByEndpoint(
        "/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=20",
      ),
    ]);

    for (const category of CATEGORY_ORDER) {
      await prisma.category.upsert({
        where: { name: category },
        update: {},
        create: {
          name: category,
          repositoryCount: 0,
        },
      });
    }

    const allRepos = [...latest, ...trending, ...updated, ...starred];
    const deduped = new Map<string, GitHubRepository>();
    for (const repo of allRepos) {
      deduped.set(repo.full_name, repo);
    }

    const repos = Array.from(deduped.values());
    for (const repo of repos) {
      const readme = await this.fetchReadme(repo.owner.login, repo.name);
      const analysis = await TogetherService.buildAiAnalysis(repo, readme);
      const starsVal = repo.stargazers_count ?? 0;
      const forksVal = repo.forks_count ?? 0;
      const createdTime = repo.created_at
        ? new Date(repo.created_at)
        : new Date();
      const updatedTime = repo.updated_at
        ? new Date(repo.updated_at)
        : new Date();

      const repoData = {
        githubId: String(repo.id),
        name: repo.name,
        owner: repo.owner.login,
        fullName: repo.full_name,
        description: repo.description ?? null,
        language: repo.language ?? null,
        stars: starsVal,
        forks: forksVal,
        url: repo.html_url,
        readme: readme ?? null,
        createdAt: createdTime,
        updatedAt: updatedTime,
      };

      const savedRepo = await RepositoryDatabase.upsertRepository(repoData);

      if (analysis.verdict || analysis.developerAnalysis) {
        const analysisData = {
          summary: analysis.aiSummary || analysis.verdict?.summary || "",
          learningValue: analysis.verdict?.learningValue || "",
          whyTrending: analysis.verdict?.summary || "",
        };
        await AnalysisDatabase.upsertAnalysis(savedRepo.id, analysisData);
      }
    }
    console.log("GitHub Sync Complete.");
  }

  static async getTrendingRepos() {
    return RepositoryDatabase.getTrendingRepositories();
  }

  static async getRepoByOwnerAndName(owner: string, name: string) {
    let repo = await RepositoryDatabase.getRepositoryByOwnerAndName(owner, name);
    if (!repo) {
      const githubRepo = await this.fetchGitHubAPI(`/repos/${owner}/${name}`);
      if (!githubRepo) return null;
      
      const readme = await this.fetchReadme(owner, name);
      const repoData = {
        githubId: String(githubRepo.id),
        name: githubRepo.name,
        owner: githubRepo.owner.login,
        fullName: githubRepo.full_name,
        description: githubRepo.description ?? null,
        language: githubRepo.language ?? null,
        stars: githubRepo.stargazers_count ?? 0,
        forks: githubRepo.forks_count ?? 0,
        url: githubRepo.html_url,
        readme: readme ?? null,
        createdAt: githubRepo.created_at ? new Date(githubRepo.created_at) : new Date(),
        updatedAt: githubRepo.updated_at ? new Date(githubRepo.updated_at) : new Date(),
      };
      
      await RepositoryDatabase.upsertRepository(repoData);
      repo = await RepositoryDatabase.getRepositoryByOwnerAndName(githubRepo.owner.login, githubRepo.name);
    }
    return repo;
  }
}
