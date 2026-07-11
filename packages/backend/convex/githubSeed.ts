import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const seedGitHubSync = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(0, internal.github.syncGitHubData, {});
  },
});
