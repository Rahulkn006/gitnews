"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoAnalyzerService = void 0;
class RepoAnalyzerService {
    static extractTechnologies(topics, language) {
        const techSet = new Set(topics);
        if (language)
            techSet.add(language.toLowerCase());
        return Array.from(techSet);
    }
}
exports.RepoAnalyzerService = RepoAnalyzerService;
//# sourceMappingURL=repoAnalyzer.service.js.map