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
export declare class TogetherService {
    private static getOpenAIClient;
    static buildAiAnalysis(repo: any, readme?: string): Promise<AiAnalysisResult>;
}
export {};
//# sourceMappingURL=together.service.d.ts.map