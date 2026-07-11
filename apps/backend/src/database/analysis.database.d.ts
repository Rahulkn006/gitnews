export declare class AnalysisDatabase {
    static upsertAnalysis(repositoryId: string, data: any): Promise<{
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
    }>;
    static getAnalysisByRepositoryId(repositoryId: string): Promise<{
        id: string;
        repositoryId: string;
        summary: string;
        whyTrending: string | null;
        learningValue: string | null;
        features: string | null;
        useCases: string | null;
        pros: string | null;
        limitations: string | null;
        difficultyLevel: string | null;
        generatedAt: Date;
        deepResearch: any;
        codeIntelligence: any;
        scores: any;
        techStack: any;
    } | null>;
}
//# sourceMappingURL=analysis.database.d.ts.map