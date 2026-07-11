import prisma from "./prisma";

export class AnalysisDatabase {
  static async upsertAnalysis(repositoryId: string, data: any) {
    return prisma.aIAnalysis.upsert({
      where: { repositoryId },
      update: data,
      create: {
        repositoryId,
        ...data,
      },
    });
  }

  static async getAnalysisByRepositoryId(repositoryId: string) {
    const analysis = await prisma.aIAnalysis.findUnique({
      where: { repositoryId },
    });
    if (!analysis) return null;
    
    return {
      ...analysis,
      deepResearch: analysis.deepResearch ? JSON.parse(analysis.deepResearch) : null,
      codeIntelligence: analysis.codeIntelligence ? JSON.parse(analysis.codeIntelligence) : null,
      scores: analysis.scores ? JSON.parse(analysis.scores) : null,
      techStack: analysis.techStack ? JSON.parse(analysis.techStack) : null,
    };
  }
}
