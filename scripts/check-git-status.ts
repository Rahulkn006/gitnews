import { execSync } from "child_process";
import { writeFileSync } from "fs";

try {
  const status = execSync("git status --short", { encoding: "utf-8" });
  const log = execSync("git log --oneline -3", { encoding: "utf-8" });
  writeFileSync("git-status-check.txt", `STATUS:\n${status}\n\nLOG:\n${log}`);
  console.log("Saved git-status-check.txt");
} catch (e) {
  writeFileSync("git-status-check.txt", `ERROR: ${e.message}`);
}
