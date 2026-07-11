"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryDatabase = void 0;
const prisma_1 = __importDefault(require("./prisma"));
class RepositoryDatabase {
    static async upsertRepository(data) {
        return prisma_1.default.repository.upsert({
            where: { githubId: data.githubId },
            update: data,
            create: data,
        });
    }
    static async getTrendingRepositories() {
        return prisma_1.default.repository.findMany({
            orderBy: { stars: "desc" },
            take: 20,
        });
    }
    static async getRepositoryByOwnerAndName(owner, name) {
        return prisma_1.default.repository.findFirst({
            where: {
                owner,
                name,
            },
            include: {
                analysis: true,
            },
        });
    }
    static async getSimilarRepositories(language, currentRepoId) {
        return prisma_1.default.repository.findMany({
            where: {
                language,
                id: { not: currentRepoId },
            },
            orderBy: { stars: "desc" },
            take: 6,
        });
    }
}
exports.RepositoryDatabase = RepositoryDatabase;
//# sourceMappingURL=repository.database.js.map