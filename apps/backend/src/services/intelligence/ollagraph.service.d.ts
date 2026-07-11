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
export declare class OllagraphClient {
    analyzeRepository(owner: string, repo: string): Promise<OllagraphAnalysis>;
    private fetchHackerNews;
    private fetchReddit;
    private fetchYouTube;
    private fetchGitHub;
    private generateDeepResearch;
    private getFallbackAnalysis;
}
export declare const ollagraph: OllagraphClient;
//# sourceMappingURL=ollagraph.service.d.ts.map