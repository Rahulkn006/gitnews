"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryService = void 0;
class SummaryService {
    static generateDeveloperReport(repoData, aiAnalysis) {
        return {
            repo: repoData.fullName,
            shouldLearn: aiAnalysis.learningValue || "Yes, highly recommended.",
            difficulty: aiAnalysis.difficultyLevel || "Intermediate",
            verdict: "Strong community backing and solid engineering."
        };
    }
}
exports.SummaryService = SummaryService;
//# sourceMappingURL=summary.service.js.map