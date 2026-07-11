import { ollagraph } from "../services/ollagraph";
import { WHY_TRENDING_DATA } from "./repository-intelligence";

/**
 * Data Handlers for Ollagraph integration.
 * These functions bridge the Ollagraph service API and the UI components,
 * ensuring the data is formatted correctly without changing the UI layer.
 */

export async function fetchWhyTrendingIntelligence() {
  // In the future, this will dynamically fetch from ollagraph:
  // const repos = await getTrendingReposFromBackend();
  // const enriched = await Promise.all(repos.map(r => ollagraph.analyzeRepositoryGraph(r.owner, r.name)));
  // return mapToWhyTrending(enriched);

  // For now, return the stable mock data to ensure UI doesn't break
  return WHY_TRENDING_DATA;
}

export async function fetchOpportunityRadar() {
  // Similarly, this will use ollagraph.crawlArticle() to find trending signals
  // For now, return the mock from learning-intelligence
  const { OPPORTUNITY_RADAR_DATA } = await import("./learning-intelligence");
  return OPPORTUNITY_RADAR_DATA;
}

export async function fetchShouldLearnThis() {
  const { SHOULD_LEARN_DATA } = await import("./learning-intelligence");
  return SHOULD_LEARN_DATA;
}
