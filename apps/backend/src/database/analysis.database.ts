import prisma from "./prisma";

export class AnalysisDatabase {
  static async upsertAnalysis(repositoryId: string, data: any) {
    return prisma.repositoryAnalysis.upsert({
      where: { repositoryId },
      update: data,
      create: {
        repositoryId,
        ...data,
      },
    });
  }

  static async getAnalysisByRepositoryId(repositoryId: string) {
    return prisma.repositoryAnalysis.findUnique({
      where: { repositoryId },
    });
  }
}
