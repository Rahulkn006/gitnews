import { getAuthUserId } from "@convex-dev/auth/server";
import { action, internalAction, internalMutation, query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OLLIMA_API_KEY,
  baseURL: process.env.OLLIMA_BASE_URL || "https://api.ollima.com/v1",
});

const GITHUB_API_BASE = "https://api.github.com";
const DEFAULT_CATEGORY = "Tools";
const CATEGORY_ORDER = ["AI", "Web Development", "Mobile", "DevOps", "Data Science", "Tools"];

function buildCategory(name?: string | null): string {
  if (!name) return DEFAULT_CATEGORY;
  const normalized = name.trim().toLowerCase();
  const category = CATEGORY_ORDER.find((candidate) =>
    candidate.toLowerCase() === normalized,
  );
  return category ?? DEFAULT_CATEGORY;
}

function normalizeTopics(topics?: string[] | null): string[] {
  return (topics ?? []).slice(0, 10).map((topic) => topic.toLowerCase());
}

type AiAnalysisResult = {
  aiSummary: string;
  developerAnalysis?: {
    targetAudience: string;
    ecosystemFit: string;
  };
  verdict?: {
    learningValue: string;
    futurePotential: string;
    communityStrength: string;
    summary: string;
  };
};

async function buildAiAnalysis(repo: GitHubRepository, readme?: string): Promise<AiAnalysisResult> {
  const language = repo.language ?? "general purpose";
  const stars = repo.stargazers_count;
  const description = repo.description ? ` ${repo.description}` : "";
  const fallbackSummary = `A ${language} repository${description} with ${stars} stars and strong community momentum.`;

  if (!process.env.OLLIMA_API_KEY) {
    return { aiSummary: fallbackSummary };
  }

  try {
    const textToAnalyze = `
Name: ${repo.name}
Description: ${repo.description ?? "None"}
Language: ${repo.language ?? "None"}
Topics: ${(repo.topics ?? []).join(", ")}
Stars: ${repo.stargazers_count}
Readme Excerpt: ${(readme ?? "").slice(0, 1000)}
    `;

    const response = await openai.chat.completions.create({
      model: "tensorzero::model_name::openai::gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a professional tech analyst. Analyze the GitHub repository and output ONLY a JSON object with the following schema:
{
  "aiSummary": "A concise, 1-sentence description summarizing its main purpose, uniqueness, and ideal developer use-case (under 20 words).",
  "developerAnalysis": {
    "targetAudience": "Who is this for? e.g., 'Beginner friendly.', 'Enterprise ready.', or 'Startups and mid-sized teams.'",
    "ecosystemFit": "How it fits into modern workflows. e.g., 'Integrates well into modern React workflows.'"
  },
  "verdict": {
    "learningValue": "e.g., 'Excellent', 'Good', 'Average'",
    "futurePotential": "e.g., 'High', 'Moderate', 'Low'",
    "communityStrength": "e.g., 'Very Active', 'Growing', 'Stable'",
    "summary": "A 1-2 sentence final verdict on why developers should or should not use this."
  }
}`,
        },
        {
          role: "user",
          content: textToAnalyze,
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (content) {
      try {
        const parsed = JSON.parse(content) as AiAnalysisResult;
        if (parsed.aiSummary) return parsed;
      } catch (parseErr) {
        console.error("Failed to parse JSON from AI", parseErr);
      }
    }
  } catch (err) {
    console.error("Ollima AI summarization failed:", err);
  }

  return { aiSummary: repo.description ?? fallbackSummary };
}

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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "gitnews-convex",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function fetchReadme(owner: string, name: string): Promise<string | undefined> {
  try {
    const readme = await fetchJson<{ content?: string }>(
      `${GITHUB_API_BASE}/repos/${owner}/${name}/readme`,
    );
    if (!readme?.content) return undefined;
    return Buffer.from(readme.content, "base64").toString("utf-8");
  } catch {
    return undefined;
  }
}

async function fetchReposByEndpoint(endpoint: string): Promise<GitHubRepository[]> {
  const data = await fetchJson<GitHubRepository[] | GitHubSearchResponse>(
    `${GITHUB_API_BASE}${endpoint}`,
  );

  if (endpoint.includes("/search/repositories")) {
    return (data as GitHubSearchResponse).items ?? [];
  }

  return Array.isArray(data) ? data : [];
}

export const syncGitHubData = internalAction({
  args: {},
  handler: async (ctx) => {
    const [latest, trending, updated, starred] = await Promise.all([
      fetchReposByEndpoint(
        "/search/repositories?q=stars:>10&sort=updated&order=desc&per_page=20",
      ),
      fetchReposByEndpoint(
        "/search/repositories?q=stars:>100&sort=stars&order=desc&per_page=20",
      ),
      fetchReposByEndpoint(
        "/search/repositories?q=stars:>10&sort=updated&order=desc&per_page=20",
      ),
      fetchReposByEndpoint(
        "/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=20",
      ),
    ]);

    for (const category of CATEGORY_ORDER) {
      await ctx.runMutation(internal.github.upsertCategory, {
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, "-"),
        description: `${category} repositories and tools`,
      });
    }

    const allRepos = [...latest, ...trending, ...updated, ...starred];
    const deduped = new Map<string, GitHubRepository>();
    for (const repo of allRepos) {
      deduped.set(repo.full_name, repo);
    }

    const repos = Array.from(deduped.values());
    for (const repo of repos) {
      const readme = await fetchReadme(repo.owner.login, repo.name);
      const analysis = await buildAiAnalysis(repo, readme);
      const starsVal = repo.stargazers_count ?? 0;
      const forksVal = repo.forks_count ?? 0;
      const createdTime = repo.created_at ? new Date(repo.created_at).getTime() : Date.now();
      const updatedTime = repo.updated_at ? new Date(repo.updated_at).getTime() : Date.now();

      await ctx.runMutation(internal.github.upsertRepository, {
        githubId: String(repo.id),
        name: repo.name,
        owner: repo.owner.login,
        avatar: repo.owner.avatar_url,
        description: repo.description ?? undefined,
        stars: starsVal,
        forks: forksVal,
        language: repo.language ?? undefined,
        topics: normalizeTopics(repo.topics),
        readme,
        repoUrl: repo.html_url,
        createdAt: isNaN(createdTime) ? Date.now() : createdTime,
        updatedAt: isNaN(updatedTime) ? Date.now() : updatedTime,
        trendingScore: starsVal + forksVal,
        aiSummary: analysis.aiSummary,
        developerAnalysis: analysis.developerAnalysis,
        verdict: analysis.verdict,
        category: buildCategory(repo.language ?? repo.name),
      });
    }

    await ctx.scheduler.runAfter(60 * 60 * 1000, internal.github.syncGitHubData, {});
  },
});

export const upsertCategory = internalMutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return ctx.db.insert("categories", args);
  },
});

export const upsertRepository = internalMutation({
  args: {
    githubId: v.string(),
    name: v.string(),
    owner: v.string(),
    avatar: v.optional(v.string()),
    description: v.optional(v.string()),
    stars: v.number(),
    forks: v.number(),
    language: v.optional(v.string()),
    topics: v.array(v.string()),
    readme: v.optional(v.string()),
    repoUrl: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    trendingScore: v.number(),
    aiSummary: v.optional(v.string()),
    developerAnalysis: v.optional(
      v.object({
        targetAudience: v.string(),
        ecosystemFit: v.string(),
      })
    ),
    verdict: v.optional(
      v.object({
        learningValue: v.string(),
        futurePotential: v.string(),
        communityStrength: v.string(),
        summary: v.string(),
      })
    ),
    category: v.optional(v.string()),
    primaryCategory: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    categoryUpdatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // 1. Insert snapshot
    await ctx.db.insert("repositorySnapshots", {
      repoId: args.githubId,
      owner: args.owner,
      name: args.name,
      stars: args.stars,
      forks: args.forks,
      watchers: args.stars, // using stars as watchers approximation if missing
      contributors: 0, // not fetched yet
      topics: args.topics,
      language: args.language,
      timestamp: now,
    });

    // 2. Fetch past snapshots for calculating growth
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const pastSnapshots = await ctx.db
      .query("repositorySnapshots")
      .withIndex("by_repo_id", (q) => q.eq("repoId", args.githubId))
      .collect();

    // Find closest snapshot to 24h ago
    let snap24h = pastSnapshots.reduce((prev, curr) => {
      return (Math.abs(curr.timestamp - dayAgo) < Math.abs(prev.timestamp - dayAgo) ? curr : prev);
    }, pastSnapshots[0]);

    // Find closest snapshot to 7d ago
    let snap7d = pastSnapshots.reduce((prev, curr) => {
      return (Math.abs(curr.timestamp - weekAgo) < Math.abs(prev.timestamp - weekAgo) ? curr : prev);
    }, pastSnapshots[0]);

    const growth24h = snap24h ? Math.max(0, args.stars - snap24h.stars) : 0;
    const forkGrowth24h = snap24h ? Math.max(0, args.forks - snap24h.forks) : 0;
    const growth7d = snap7d ? Math.max(0, args.stars - snap7d.stars) : 0;
    
    const ageInDays = Math.max(1, (now - args.createdAt) / (24 * 60 * 60 * 1000));
    const starsPerDay = args.stars / ageInDays;
    
    // velocityScore: star velocity + fork growth + event activity
    // For now, proxy event activity with a random bump or trending score component
    const velocityScore = growth24h + forkGrowth24h + (args.trendingScore / 1000);
    const gitnewsScore = velocityScore * 10 + starsPerDay;
    
    const recentActivityBonus = (now - args.updatedAt < 7 * 24 * 60 * 60 * 1000) ? 500 : 0;
    const newTrendingScore = args.stars + growth24h + growth7d + recentActivityBonus;

    const existing = await ctx.db
      .query("repositories")
      .withIndex("by_github_id", (q) => q.eq("githubId", args.githubId))
      .unique();

    let mergedCategories = args.categories || [];
    let mergedTags = args.tags || [];

    if (existing) {
      if (args.categories) {
        mergedCategories = Array.from(new Set([...(existing.categories || []), ...args.categories]));
      } else {
        mergedCategories = existing.categories || [];
      }

      if (args.tags) {
        mergedTags = Array.from(new Set([...(existing.tags || []), ...args.tags]));
      } else {
        mergedTags = existing.tags || [];
      }
    }

    const dataToSave = {
      ...args,
      growth24h,
      growth7d,
      starsPerDay,
      velocityScore,
      gitnewsScore,
      trendingScore: newTrendingScore,
      categories: mergedCategories.length > 0 ? mergedCategories : undefined,
      tags: mergedTags.length > 0 ? mergedTags : undefined,
    };

    if (existing) {
      await ctx.db.patch(existing._id, dataToSave);
      return existing._id;
    }

    return ctx.db.insert("repositories", dataToSave);
  },
});

export const getLatestRepos = query({
  args: {},
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").collect();
    return repos
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 12);
  },
});

export const getAllRepos = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("repositories").collect();
  }
});

export const getTrendingRepos = query({
  args: {},
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").collect();
    return repos
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 12);
  },
});

export const getFeaturedRepos = query({
  args: {},
  handler: async (ctx) => {
    const repos = await ctx.db.query("repositories").collect();
    return repos
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 12);
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("categories").collect();
  },
});

export const getRepoDetails = query({
  args: { githubId: v.string() },
  handler: async (ctx, { githubId }) => {
    const repo = await ctx.db
      .query("repositories")
      .withIndex("by_github_id", (q) => q.eq("githubId", githubId))
      .unique();
    return repo ?? null;
  },
});

export const getRepoByOwnerAndName = query({
  args: { owner: v.string(), name: v.string() },
  handler: async (ctx, { owner, name }) => {
    const repo = await ctx.db
      .query("repositories")
      .withIndex("by_owner_name", (q) => q.eq("owner", owner).eq("name", name))
      .unique();
    return repo ?? null;
  },
});

export const getReposByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, { category }) => {
    const repos = await ctx.db.query("repositories").collect();
    return repos
      .filter((repo) => repo.category === category)
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 24);
  },
});

export const bookmarkRepo = mutation({
  args: { repositoryId: v.id("repositories") },
  handler: async (ctx, { repositoryId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_repository", (q) => q.eq("userId", userId).eq("repositoryId", repositoryId))
      .unique();

    if (existing) return existing._id;

    return ctx.db.insert("bookmarks", {
      userId,
      repositoryId,
      createdAt: Date.now(),
    });
  },
});

export const removeBookmark = mutation({
  args: { repositoryId: v.id("repositories") },
  handler: async (ctx, { repositoryId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_repository", (q) => q.eq("userId", userId).eq("repositoryId", repositoryId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const toggleBookmark = mutation({
  args: { repositoryId: v.id("repositories") },
  handler: async (ctx, { repositoryId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_repository", (q) => q.eq("userId", userId).eq("repositoryId", repositoryId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }

    await ctx.db.insert("bookmarks", {
      userId,
      repositoryId,
      createdAt: Date.now(),
    });

    return true;
  },
});

export const getBookmarks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const repos = await Promise.all(
      bookmarks.map(async (bookmark) => ctx.db.get(bookmark.repositoryId)),
    );

    return repos.filter((repo): repo is NonNullable<typeof repo> => Boolean(repo));
  },
});

export const seedSampleRepositories = internalMutation({
  args: {},
  handler: async (ctx) => {
    const samples = [
      {
        githubId: "sample-1",
        name: "react",
        owner: "facebook",
        avatar: "https://github.com/facebook.png",
        description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
        stars: 220000,
        forks: 45000,
        language: "JavaScript",
        topics: ["react", "frontend", "ui", "javascript"],
        repoUrl: "https://github.com/facebook/react",
        createdAt: new Date("2013-05-24").getTime(),
        updatedAt: Date.now(),
        trendingScore: 265000,
        aiSummary: "The dominant library for component-based web interfaces, backed by Meta and a massive ecosystem.",
        category: "Web Development",
        primaryCategory: "Frontend",
        categories: ["Frontend"],
        tags: ["react", "ui"],
        developerAnalysis: {
          targetAudience: "Frontend developers of all levels.",
          ecosystemFit: "Core to the modern React/Next.js ecosystem.",
        },
        verdict: {
          learningValue: "Excellent",
          futurePotential: "Very High",
          communityStrength: "Massive",
          summary: "A must-know foundation for modern web development.",
        },
      },
      {
        githubId: "sample-2",
        name: "tensorflow",
        owner: "tensorflow",
        avatar: "https://github.com/tensorflow.png",
        description: "An Open Source Machine Learning Framework for Everyone.",
        stars: 182000,
        forks: 74000,
        language: "Python",
        topics: ["machine-learning", "deep-learning", "ai", "python"],
        repoUrl: "https://github.com/tensorflow/tensorflow",
        createdAt: new Date("2015-11-09").getTime(),
        updatedAt: Date.now(),
        trendingScore: 256000,
        aiSummary: "Google's flagship ML framework, widely used for research and production deep learning.",
        category: "Data Science",
        developerAnalysis: {
          targetAudience: "ML engineers and researchers.",
          ecosystemFit: "Integrates with Keras, TFX, and Google Cloud ML.",
        },
        verdict: {
          learningValue: "Good",
          futurePotential: "High",
          communityStrength: "Very Active",
          summary: "Industry standard for production machine learning.",
        },
      },
      {
        githubId: "sample-3",
        name: "kubernetes",
        owner: "kubernetes",
        avatar: "https://github.com/kubernetes.png",
        description: "Production-Grade Container Scheduling and Management.",
        stars: 110000,
        forks: 39000,
        language: "Go",
        topics: ["kubernetes", "containers", "devops", "orchestration"],
        repoUrl: "https://github.com/kubernetes/kubernetes",
        createdAt: new Date("2014-06-06").getTime(),
        updatedAt: Date.now(),
        trendingScore: 149000,
        aiSummary: "The open-source container orchestration platform that became the standard for cloud-native deployments.",
        category: "DevOps",
        developerAnalysis: {
          targetAudience: "Platform engineers and DevOps teams.",
          ecosystemFit: "Native to cloud-native and CI/CD pipelines.",
        },
        verdict: {
          learningValue: "Excellent",
          futurePotential: "Very High",
          communityStrength: "Massive",
          summary: "Essential infrastructure knowledge for modern cloud deployments.",
        },
      },
      {
        githubId: "sample-4",
        name: "langchain",
        owner: "langchain-ai",
        avatar: "https://github.com/langchain-ai.png",
        description: "Building applications with LLMs through composability.",
        stars: 92000,
        forks: 15000,
        language: "Python",
        topics: ["llm", "ai", "agents", "langchain"],
        repoUrl: "https://github.com/langchain-ai/langchain",
        createdAt: new Date("2022-10-17").getTime(),
        updatedAt: Date.now(),
        trendingScore: 107000,
        aiSummary: "The most popular framework for building LLM-powered applications and agent workflows.",
        category: "AI",
        primaryCategory: "AI",
        categories: ["AI", "Developer Tools"],
        tags: ["llm", "agents"],
        developerAnalysis: {
          targetAudience: "AI application developers and LLM prototypers.",
          ecosystemFit: "Plugs into OpenAI, Anthropic, HuggingFace, and vector stores.",
        },
        verdict: {
          learningValue: "High",
          futurePotential: "High",
          communityStrength: "Very Active",
          summary: "Best starting point for building production LLM apps.",
        },
      },
      {
        githubId: "sample-5",
        name: "vscode",
        owner: "microsoft",
        avatar: "https://github.com/microsoft.png",
        description: "Visual Studio Code.",
        stars: 160000,
        forks: 28000,
        language: "TypeScript",
        topics: ["editor", "ide", "typescript", "electron"],
        repoUrl: "https://github.com/microsoft/vscode",
        createdAt: new Date("2015-09-03").getTime(),
        updatedAt: Date.now(),
        trendingScore: 188000,
        aiSummary: "The world's most popular code editor, extensible through a massive marketplace of extensions.",
        category: "Tools",
        developerAnalysis: {
          targetAudience: "All developers.",
          ecosystemFit: "Universal IDE with extensions for every language and framework.",
        },
        verdict: {
          learningValue: "Excellent",
          futurePotential: "High",
          communityStrength: "Massive",
          summary: "Daily-driver editor with unmatched extension ecosystem.",
        },
      },
      {
        githubId: "sample-6",
        name: "swift",
        owner: "apple",
        avatar: "https://github.com/apple.png",
        description: "The Swift Programming Language.",
        stars: 67000,
        forks: 10200,
        language: "Swift",
        topics: ["swift", "ios", "programming-language", "apple"],
        repoUrl: "https://github.com/apple/swift",
        createdAt: new Date("2015-10-23").getTime(),
        updatedAt: Date.now(),
        trendingScore: 77200,
        aiSummary: "Apple's modern systems programming language for iOS, macOS, and server-side Swift.",
        category: "Mobile",
        developerAnalysis: {
          targetAudience: "iOS and macOS developers.",
          ecosystemFit: "Native language for Apple's platforms and tooling.",
        },
        verdict: {
          learningValue: "Good",
          futurePotential: "Moderate",
          communityStrength: "Active",
          summary: "Required for Apple platform development.",
        },
      },
      {
        githubId: "sample-7",
        name: "pytorch",
        owner: "pytorch",
        avatar: "https://github.com/pytorch.png",
        description: "Tensors and Dynamic neural networks in Python with strong GPU acceleration.",
        stars: 85000,
        forks: 23000,
        language: "Python",
        topics: ["pytorch", "deep-learning", "machine-learning", "gpu"],
        repoUrl: "https://github.com/pytorch/pytorch",
        createdAt: new Date("2016-08-12").getTime(),
        updatedAt: Date.now(),
        trendingScore: 108000,
        aiSummary: "The research-friendly deep learning framework favored by academics and production ML teams.",
        category: "Data Science",
        developerAnalysis: {
          targetAudience: "ML researchers and practitioners.",
          ecosystemFit: "Works with HuggingFace, Lightning, and major cloud ML platforms.",
        },
        verdict: {
          learningValue: "Excellent",
          futurePotential: "Very High",
          communityStrength: "Very Active",
          summary: "Top choice for flexible deep learning experimentation.",
        },
      },
      {
        githubId: "sample-8",
        name: "ollama",
        owner: "ollama",
        avatar: "https://github.com/ollama.png",
        description: "Get up and running with Llama 3.2, Mistral, Gemma 2, and other large language models.",
        stars: 98000,
        forks: 7800,
        language: "Go",
        topics: ["llm", "local-ai", "ollama", "mistral"],
        repoUrl: "https://github.com/ollama/ollama",
        createdAt: new Date("2023-06-26").getTime(),
        updatedAt: Date.now(),
        trendingScore: 105800,
        aiSummary: "The easiest way to run open-source LLMs locally on macOS, Linux, and Windows.",
        category: "AI",
        developerAnalysis: {
          targetAudience: "Developers experimenting with local LLMs.",
          ecosystemFit: "Pairs with LangChain, OpenAI-compatible APIs, and local RAG stacks.",
        },
        verdict: {
          learningValue: "High",
          futurePotential: "Very High",
          communityStrength: "Very Active",
          summary: "Best local LLM runner for developers and privacy-focused teams.",
        },
      },
    ];

    for (const sample of samples) {
      const existing = await ctx.db
        .query("repositories")
        .withIndex("by_github_id", (q) => q.eq("githubId", sample.githubId))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, sample);
      } else {
        await ctx.db.insert("repositories", sample);
      }
    }

    for (const category of CATEGORY_ORDER) {
      await ctx.runMutation(internal.github.upsertCategory, {
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, "-"),
        description: `${category} repositories and tools`,
      });
    }
  },
});

export const scheduleGitHubSync = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(0, internal.github.syncGitHubData, {});
  },
});

export const syncCategoryRepositories = internalAction({
  args: {},
  handler: async (ctx) => {
    const CATEGORY_QUERIES = [
      { name: "AI", query: "topic:artificial-intelligence+topic:llm+topic:generative-ai" },
      { name: "Frontend", query: "topic:react+topic:vue+topic:frontend" },
      { name: "Backend", query: "topic:api+topic:backend" },
      { name: "DevOps", query: "topic:docker+topic:kubernetes" },
      { name: "Database", query: "topic:database+topic:postgresql" },
      { name: "Security", query: "topic:security+topic:cybersecurity" },
      { name: "Mobile", query: "topic:flutter+topic:android" },
      { name: "Developer Tools", query: "topic:cli+topic:developer-tools" },
    ];

    for (const c of CATEGORY_QUERIES) {
      // Instead of encodeURIComponent which encodes '+', we just use the pre-formatted query string
      const endpoint = `/search/repositories?q=${c.query}&sort=stars&order=desc&per_page=20`;
      const repos = await fetchReposByEndpoint(endpoint);

      for (const repo of repos) {
        const starsVal = repo.stargazers_count ?? 0;
        const forksVal = repo.forks_count ?? 0;
        const createdTime = repo.created_at ? new Date(repo.created_at).getTime() : Date.now();
        const updatedTime = repo.updated_at ? new Date(repo.updated_at).getTime() : Date.now();

        await ctx.runMutation(internal.github.upsertRepository, {
          githubId: String(repo.id),
          name: repo.name,
          owner: repo.owner.login,
          avatar: repo.owner.avatar_url,
          description: repo.description ?? undefined,
          stars: starsVal,
          forks: forksVal,
          language: repo.language ?? undefined,
          topics: normalizeTopics(repo.topics),
          repoUrl: repo.html_url,
          createdAt: isNaN(createdTime) ? Date.now() : createdTime,
          updatedAt: isNaN(updatedTime) ? Date.now() : updatedTime,
          trendingScore: starsVal + forksVal, // base score, will be updated in mutation
          category: buildCategory(repo.language ?? repo.name), // keep original category string logic
          primaryCategory: c.name,
          categories: [c.name],
          categoryUpdatedAt: Date.now(),
        });
      }
    }
  },
});

export const fetchTopicOnDemand = action({
  args: { topic: v.string() },
  handler: async (ctx, args) => {
    // Sanitize topic for GitHub search
    const sanitizedTopic = args.topic.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!sanitizedTopic) return;

    const endpoint = `/search/repositories?q=topic:${sanitizedTopic}&sort=stars&order=desc&per_page=15`;
    const repos = await fetchReposByEndpoint(endpoint);

    for (const repo of repos) {
      const starsVal = repo.stargazers_count ?? 0;
      const forksVal = repo.forks_count ?? 0;
      const createdTime = repo.created_at ? new Date(repo.created_at).getTime() : Date.now();
      const updatedTime = repo.updated_at ? new Date(repo.updated_at).getTime() : Date.now();

      await ctx.runMutation(internal.github.upsertRepository, {
        githubId: String(repo.id),
        name: repo.name,
        owner: repo.owner.login,
        avatar: repo.owner.avatar_url,
        description: repo.description ?? undefined,
        stars: starsVal,
        forks: forksVal,
        language: repo.language ?? undefined,
        topics: normalizeTopics(repo.topics),
        repoUrl: repo.html_url,
        createdAt: isNaN(createdTime) ? Date.now() : createdTime,
        updatedAt: isNaN(updatedTime) ? Date.now() : updatedTime,
        trendingScore: starsVal + forksVal,
        category: buildCategory(repo.language ?? repo.name),
        primaryCategory: "Discovered",
        categories: ["Discovered"],
        categoryUpdatedAt: Date.now(),
      });
    }
  },
});

export const syncGlobalRepositories = internalAction({
  args: {},
  handler: async (ctx) => {
    // Randomize sort between stars and updated to get a diverse sweep
    const sorts = ["stars", "updated"];
    const randomSort = sorts[Math.floor(Math.random() * sorts.length)];
    
    // Search for repos with >500 stars
    const endpoint = `/search/repositories?q=stars:>500&sort=${randomSort}&order=desc&per_page=30`;
    const repos = await fetchReposByEndpoint(endpoint);

    for (const repo of repos) {
      const starsVal = repo.stargazers_count ?? 0;
      const forksVal = repo.forks_count ?? 0;
      const createdTime = repo.created_at ? new Date(repo.created_at).getTime() : Date.now();
      const updatedTime = repo.updated_at ? new Date(repo.updated_at).getTime() : Date.now();

      await ctx.runMutation(internal.github.upsertRepository, {
        githubId: String(repo.id),
        name: repo.name,
        owner: repo.owner.login,
        avatar: repo.owner.avatar_url,
        description: repo.description ?? undefined,
        stars: starsVal,
        forks: forksVal,
        language: repo.language ?? undefined,
        topics: normalizeTopics(repo.topics),
        repoUrl: repo.html_url,
        createdAt: isNaN(createdTime) ? Date.now() : createdTime,
        updatedAt: isNaN(updatedTime) ? Date.now() : updatedTime,
        trendingScore: starsVal + forksVal,
        category: buildCategory(repo.language ?? repo.name),
        primaryCategory: "Global",
        categories: ["Global"],
        categoryUpdatedAt: Date.now(),
      });
    }
  },
});


