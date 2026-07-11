import { mockRepositories } from "./apps/astro-web/src/data/repositories.js";

const repositories = mockRepositories;
const topics = repositories.reduce((acc, r) => {
  if(r.topics) {
    r.topics.forEach((t) => {
      if (!["github", "api", "library"].includes(t.toLowerCase())) {
        acc[t] = (acc[t] || 0) + (r.growth24h || 1);
      }
    });
  }
  return acc;
}, {});

console.log(topics);
