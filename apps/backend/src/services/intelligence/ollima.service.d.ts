export interface OllimaIntelligence {
    summary: string;
    whyTrending: string;
    difficulty: string;
    strengths: string[];
    limitations: string[];
    useCases: string[];
    alternatives: string[];
}
export declare class OllimaService {
    /**
     * Generates structured repository intelligence using Ollima API
     */
    generateIntelligence(repoData: any, owner: string, repo: string): Promise<OllimaIntelligence>;
}
export declare const ollima: OllimaService;
//# sourceMappingURL=ollima.service.d.ts.map