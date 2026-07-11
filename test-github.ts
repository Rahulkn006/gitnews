import { GitHubService } from "./apps/backend/src/services/github.service";
import * as dotenv from "dotenv";
dotenv.config({ path: "./apps/backend/.env" });
async function run() {
  const repo = await GitHubService.fetchGitHubAPI('/repos/facebook/react');
  console.log(repo ? `name: ${repo.name}, owner: ${repo.owner.login}` : "null");
}
run();
