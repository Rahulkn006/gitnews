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
export declare class GitHubService {
    static fetchJson<T>(url: string): Promise<T>;
    static fetchGitHubAPI(endpoint: string): Promise<any>;
    static fetchReadme(owner: string, name: string): Promise<string | undefined>;
    static fetchRepoTree(owner: string, repo: string): Promise<any>;
    static fetchRepoFile(owner: string, repo: string, path: string): Promise<string | null>;
    static fetchReposByEndpoint(endpoint: string): Promise<GitHubRepository[]>;
    static syncGitHubData(): Promise<void>;
    static getTrendingRepos(): Promise<{
        id: string;
        githubId: string;
        name: string;
        owner: string;
        fullName: string;
        description: string | null;
        language: string | null;
        topics: string | null;
        stars: number;
        forks: number;
        contributors: number;
        url: string;
        readme: string | null;
        lastActivity: Date | null;
        createdAt: Date;
        updatedAt: Date;
        trendingScore: number;
        growth24h: number;
        gitnewsScore: number;
    }[]>;
    static getRepoByOwnerAndName(owner: string, name: string): Promise<({
        analysis: {
            id: string;
            repositoryId: string;
            summary: string;
            whyTrending: string | null;
            learningValue: string | null;
            features: string | null;
            useCases: string | null;
            pros: string | null;
            limitations: string | null;
            techStack: string | null;
            difficultyLevel: string | null;
            codeIntelligence: string | null;
            scores: string | null;
            deepResearch: string | null;
            generatedAt: Date;
        } | null;
    } & {
        id: string;
        githubId: string;
        name: string;
        owner: string;
        fullName: string;
        description: string | null;
        language: string | null;
        topics: string | null;
        stars: number;
        forks: number;
        contributors: number;
        url: string;
        readme: string | null;
        lastActivity: Date | null;
        createdAt: Date;
        updatedAt: Date;
        trendingScore: number;
        growth24h: number;
        gitnewsScore: number;
    }) | null>;
}
export {};
//# sourceMappingURL=github.service.d.ts.map