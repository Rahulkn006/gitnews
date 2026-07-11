import prisma from "./prisma";

export class RepositoryDatabase {
  static async upsertRepository(data: any) {
    return prisma.repository.upsert({
      where: { githubId: data.githubId },
      update: data,
      create: data,
    });
  }

  static async getTrendingRepositories() {
    return prisma.repository.findMany({
      orderBy: { stars: "desc" },
      take: 20,
    });
  }

  static async getRepositoryByOwnerAndName(owner: string, name: string) {
    return prisma.repository.findFirst({
      where: {
        owner,
        name,
      },
      include: {
        analysis: true,
      },
    });
  }

  static async getSimilarRepositories(language: string, currentRepoId: string) {
    return prisma.repository.findMany({
      where: {
        language,
        id: { not: currentRepoId },
      },
      orderBy: { stars: "desc" },
      take: 6,
    });
  }
}
