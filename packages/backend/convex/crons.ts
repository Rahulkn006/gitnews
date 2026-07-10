import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "hourly GitHub sync",
  { minutes: 60 },
  internal.github.syncGitHubData,
  {},
);

crons.interval(
  "category repos sync",
  { minutes: 120 },
  internal.github.syncCategoryRepositories,
  {},
);

crons.interval(
  "global star-sweeper sync",
  { minutes: 60 },
  internal.github.syncGlobalRepositories,
  {},
);

export default crons;
