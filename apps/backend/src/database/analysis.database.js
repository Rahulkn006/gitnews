"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisDatabase = void 0;
const prisma_1 = __importDefault(require("./prisma"));
class AnalysisDatabase {
    static async upsertAnalysis(repositoryId, data) {
        return prisma_1.default.aIAnalysis.upsert({
            where: { repositoryId },
            update: data,
            create: {
                repositoryId,
                ...data,
            },
        });
    }
    static async getAnalysisByRepositoryId(repositoryId) {
        const analysis = await prisma_1.default.aIAnalysis.findUnique({
            where: { repositoryId },
        });
        if (!analysis)
            return null;
        return {
            ...analysis,
            deepResearch: analysis.deepResearch ? JSON.parse(analysis.deepResearch) : null,
            codeIntelligence: analysis.codeIntelligence ? JSON.parse(analysis.codeIntelligence) : null,
            scores: analysis.scores ? JSON.parse(analysis.scores) : null,
            techStack: analysis.techStack ? JSON.parse(analysis.techStack) : null,
        };
    }
}
exports.AnalysisDatabase = AnalysisDatabase;
//# sourceMappingURL=analysis.database.js.map