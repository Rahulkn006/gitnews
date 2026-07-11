interface YoutubeVideo {
  id: string;
  title: string;
  creator: string;
  views: string;
  timeAgo: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  whyWatchThis: string;
  thumbnailUrl: string;
  url: string;
}

interface CacheEntry {
  videos: YoutubeVideo[];
  createdAt: number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const cache = new Map<string, CacheEntry>();

export const youtubeService = {
  async getLearningVideos(
    repoName: string,
    owner: string,
    language?: string,
  ): Promise<YoutubeVideo[]> {
    const cacheKey = `${owner}/${repoName}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.createdAt < CACHE_TTL) {
      console.log(`[YouTube] Cache hit for ${cacheKey}`);
      return cached.videos;
    }

    try {
      const apiKey =
        process.env.YOUTUBE_API_KEY ||
        (import.meta as any).env?.YOUTUBE_API_KEY;

      if (!apiKey) {
        console.warn(
          `[YouTube] Missing YOUTUBE_API_KEY, falling back to mock data for ${repoName}.`,
        );
        return this.getMockVideos(repoName);
      }

      console.log(`[YouTube] Fetching real learning videos for ${cacheKey}...`);
      const searchQuery = encodeURIComponent(
        `${repoName} ${language || "tutorial"} crash course OR tutorial OR project`,
      );

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${searchQuery}&type=video&key=${apiKey}`,
      );

      if (!res.ok) {
        throw new Error(`YouTube API failed: ${res.statusText}`);
      }

      const data = await res.json();

      // In a full implementation, we'd make a second call to 'videos' endpoint to get viewCount and duration.
      // For Phase 1, we will map search results and simulate grouping/metrics to keep it simple and limit API hits.

      const mappedVideos = data.items.map((item: any, index: number) => {
        const difficulties: ("Beginner" | "Intermediate" | "Advanced")[] = [
          "Beginner",
          "Intermediate",
          "Advanced",
        ];
        return {
          id: item.id.videoId || `vid-${index}`,
          title: item.snippet.title,
          creator: item.snippet.channelTitle,
          views: `${Math.floor(Math.random() * 900) + 10}K views`, // Simulated until deep video API integration
          timeAgo: new Date(item.snippet.publishedAt).toLocaleDateString(),
          duration: ["14:20", "1:45:00", "32:15"][index % 3], // Simulated
          difficulty: difficulties[index % 3],
          whyWatchThis: item.snippet.description.substring(0, 100) + "...",
          thumbnailUrl:
            item.snippet.thumbnails.high?.url ||
            item.snippet.thumbnails.medium?.url ||
            item.snippet.thumbnails.default?.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        };
      });

      if (mappedVideos.length === 0) {
        return this.getMockVideos(repoName);
      }

      cache.set(cacheKey, { videos: mappedVideos, createdAt: Date.now() });
      return mappedVideos;
    } catch (error) {
      console.error("[YouTube] API error:", error);
      // Fallback to cache or mock
      return cached ? cached.videos : this.getMockVideos(repoName);
    }
  },

  getMockVideos(repoName: string): YoutubeVideo[] {
    return [
      {
        id: "mock1",
        title: `${repoName} Complete Crash Course for Beginners (2026)`,
        creator: "Fireship",
        views: "1.2M views",
        timeAgo: "2 weeks ago",
        duration: "14:20",
        difficulty: "Beginner",
        whyWatchThis:
          "A fast-paced, high-level overview perfect for getting your local environment setup and understanding core concepts.",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=640&auto=format&fit=crop",
        url: "#",
      },
      {
        id: "mock2",
        title: `Building a Fullstack App with ${repoName} from Scratch`,
        creator: "Traversy Media",
        views: "840K views",
        timeAgo: "1 month ago",
        duration: "1:45:00",
        difficulty: "Intermediate",
        whyWatchThis:
          "Detailed project walkthrough showing practical patterns for state management and API integration.",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=640&auto=format&fit=crop",
        url: "#",
      },
      {
        id: "mock3",
        title: `${repoName} Advanced Architecture and Scaling Patterns`,
        creator: "Theo - t3.gg",
        views: "450K views",
        timeAgo: "3 months ago",
        duration: "32:15",
        difficulty: "Advanced",
        whyWatchThis:
          "Deep dive into performance optimizations, edge computing, and resolving common bottlenecks at scale.",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=640&auto=format&fit=crop",
        url: "#",
      },
    ];
  },
};
