import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const seedGitHubSync = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(0, internal.github.syncGitHubData, {});
  },
});
