export interface RelatedRepo {
  name: string;
  stars: number;
  language: string;
  description: string;
  url: string;
  trendingStatus: "rising" | "hot" | "stable";
}

export interface AINewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  keyPoints: string[];
  developerImpact: string;
  image: string;
  source: string;
  category:
    | "AI Models"
    | "Developer Tools"
    | "Open Source"
    | "Research"
    | "Startups"
    | "GitHub";
  publishedAt: string;
  url: string;
  relatedRepos: RelatedRepo[];
}

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
let cachedNews: { data: AINewsItem[]; timestamp: number } | null = null;

export const newsService = {
  async getLatestAINews(): Promise<AINewsItem[]> {
    if (cachedNews && Date.now() - cachedNews.timestamp < CACHE_TTL) {
      return cachedNews.data;
    }

    try {
      console.log("[News] Fetching live news from HackerNews...");
      const hnRes = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json",
      );
      if (!hnRes.ok) throw new Error("Failed to fetch HN top stories");

      const storyIds = await hnRes.json();
      const topIds = storyIds.slice(0, 15);

      const stories = await Promise.all(
        topIds.map((id: number) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
            (res) => res.json(),
          ),
        ),
      );

      const fallbackImages = [
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531297172868-6cb312d93be4?q=80&w=800&auto=format&fit=crop",
      ];

      const liveNews: AINewsItem[] = stories
        .filter(Boolean)
        .map((story, idx) => ({
          id: `hn-${story.id}`,
          title: story.title,
          summary: `HackerNews Top Story: ${story.title}`,
          content: `This story is currently trending on HackerNews with ${story.score} points and ${story.descendants} comments. Read more at the source.`,
          keyPoints: [
            `Trending with ${story.score} points`,
            `Discussed by ${story.descendants} developers`,
            `Posted by ${story.by}`,
          ],
          developerImpact:
            "Keep up with the latest trends and tools being discussed by the developer community on HackerNews.",
          image: fallbackImages[idx % fallbackImages.length],
          source: "HackerNews",
          category:
            story.title.toLowerCase().includes("ai") ||
            story.title.toLowerCase().includes("llm")
              ? "AI Models"
              : "Developer Tools",
          publishedAt: new Date(story.time * 1000).toLocaleTimeString(),
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          relatedRepos: [
            // Mock related repos for now as extracting them from HN dynamically requires NLP
            {
              name: "hacker-news-api",
              stars: 1200,
              language: "JavaScript",
              description: "Firebase API for HN",
              url: "https://github.com/HackerNews/API",
              trendingStatus: "stable",
            },
          ],
        }));

      // Merge with some curated high-quality fallbacks to guarantee robust UI
      const curated = this.getFallbackNews();

      const finalNews = [...liveNews.slice(0, 5), ...curated];
      cachedNews = { data: finalNews, timestamp: Date.now() };
      return finalNews;
    } catch (error) {
      console.error("[News] Failed to fetch live news:", error);
      if (cachedNews) return cachedNews.data;
      return this.getFallbackNews();
    }
  },

  getFallbackNews(): AINewsItem[] {
    return [
      {
        id: "ai-1",
        title: "GPT-5.6 Sol Ultra integrated into Codex platform",
        summary:
          "Codex has announced full integration of the new GPT-5.6 Sol Ultra model, yielding major performance boosts in multi-file repository maintenance and code refactoring workflows.",
        content:
          "Codex Labs has successfully deployed the highly anticipated GPT-5.6 Sol Ultra model into their core architecture. This update brings a fundamental shift in how the platform handles cross-file dependencies and large-scale refactoring. Early benchmarks indicate a 40% reduction in context loss and a massive improvement in identifying subtle architectural flaws.",
        keyPoints: [
          "40% reduction in context loss during large refactors",
          "Native integration with existing Codex CLI tools",
          "Significantly faster response times for AST parsing",
        ],
        developerImpact:
          "Developers can now offload complex, multi-file refactoring tasks with higher confidence, reducing technical debt more efficiently.",
        image:
          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
        source: "Codex Labs",
        category: "AI Models",
        publishedAt: "2 hours ago",
        url: "#",
        relatedRepos: [
          {
            name: "codex-cli",
            stars: 12500,
            language: "TypeScript",
            description: "Official CLI for Codex Labs",
            url: "#",
            trendingStatus: "hot",
          },
          {
            name: "sol-ultra-benchmarks",
            stars: 890,
            language: "Python",
            description: "Open source benchmarks for Sol Ultra",
            url: "#",
            trendingStatus: "rising",
          },
        ],
      },
      {
        id: "ai-5",
        title: "New AI Agent Framework Released",
        summary:
          "A powerful new open-source agentic framework has been released, promising to simplify the orchestration of multi-agent workflows.",
        content:
          "The landscape of AI orchestration is shifting again with the release of a new, highly optimized agent framework. Designed to solve the state-management nightmares of earlier tools, this new library introduces deterministic state machines for multi-agent conversations, making debugging complex workflows significantly easier.",
        keyPoints: [
          "Deterministic state machines for agents",
          "Built-in debugging and trace logging",
          "Seamless integration with existing LLM providers",
        ],
        developerImpact:
          "Building complex, multi-agent systems is now much more reliable and easier to test, opening the door for production-grade agentic applications.",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
        source: "TechCrunch",
        category: "Startups",
        publishedAt: "2 days ago",
        url: "#",
        relatedRepos: [
          {
            name: "langgraph",
            stars: 15400,
            language: "Python",
            description:
              "Building stateful, multi-actor applications with LLMs",
            url: "#",
            trendingStatus: "hot",
          },
          {
            name: "autogen",
            stars: 28900,
            language: "Python",
            description: "Enable next-gen LLM applications",
            url: "#",
            trendingStatus: "stable",
          },
          {
            name: "crewai",
            stars: 12000,
            language: "Python",
            description:
              "Framework for orchestrating role-playing autonomous AI agents",
            url: "#",
            trendingStatus: "rising",
          },
        ],
      },
    ];
  },
};
