export declare class YouTubeService {
    /**
     * Fetches YouTube tutorials and resources for a given technology or repository.
     */
    static getResourcesForRepo(repoName: string, topics: string[]): Promise<{
        videoId: string;
        title: string;
        channel: string;
        thumbnail: string;
        views: number;
        publishedAt: Date;
        type: string;
    }[]>;
}
//# sourceMappingURL=youtube.service.d.ts.map