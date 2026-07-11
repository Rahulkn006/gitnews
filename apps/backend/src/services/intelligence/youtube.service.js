"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeService = void 0;
class YouTubeService {
    /**
     * Fetches YouTube tutorials and resources for a given technology or repository.
     */
    static async getResourcesForRepo(repoName, topics) {
        // In a real environment, this would call the YouTube Data API.
        // For now, we return intelligent mock data to preserve the UI integration.
        return [
            {
                videoId: "mock-video-1",
                title: `Getting Started with ${repoName}`,
                channel: "Tech Tutorials",
                thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
                views: 15400,
                publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                type: "tutorial"
            },
            {
                videoId: "mock-video-2",
                title: `${repoName} Explained in 100 Seconds`,
                channel: "Fireship Clone",
                thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
                views: 89000,
                publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                type: "explanation"
            }
        ];
    }
}
exports.YouTubeService = YouTubeService;
//# sourceMappingURL=youtube.service.js.map