"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = startScheduler;
const node_cron_1 = __importDefault(require("node-cron"));
const github_service_1 = require("../services/github.service");
function startScheduler() {
    // Run every 1 hour
    node_cron_1.default.schedule("0 * * * *", async () => {
        console.log("Running GitHub Sync Job");
        try {
            await github_service_1.GitHubService.syncGitHubData();
            console.log("GitHub Sync completed successfully");
        }
        catch (error) {
            console.error("GitHub Sync failed", error);
        }
    });
    console.log("Scheduler initialized");
}
//# sourceMappingURL=githubSync.js.map