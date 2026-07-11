import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function setupScheduler() {
  console.log("Setting up cron jobs...");

  // Run every hour to fetch trending repositories
  cron.schedule("0 * * * *", async () => {
    console.log("Running scheduled job: Fetching trending repositories...");
    try {
      // Dummy logic to simulate fetching from GitHub API and saving to DB
      console.log("Trending repositories updated successfully.");
    } catch (error) {
      console.error("Error updating trending repositories:", error);
    }
  });

  // Run daily at midnight to aggregate market signals
  cron.schedule("0 0 * * *", async () => {
    console.log("Running scheduled job: Aggregating market signals...");
    try {
      // Dummy logic to simulate market analysis
      console.log("Market signals updated successfully.");
    } catch (error) {
      console.error("Error updating market signals:", error);
    }
  });

  // Run daily at 1 AM to update company repositories
  cron.schedule("0 1 * * *", async () => {
    console.log("Running scheduled job: Updating company repositories...");
    try {
      // Dummy logic to simulate company repo fetch
      console.log("Company repositories updated successfully.");
    } catch (error) {
      console.error("Error updating company repositories:", error);
    }
  });

  console.log("Cron jobs scheduled.");
}
