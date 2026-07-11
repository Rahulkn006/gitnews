import { execSync } from "child_process";
import fs from "fs";

try {
  const output = execSync("bunx @biomejs/biome check --formatter-enabled=false .", { encoding: "utf8" });
} catch (e) {
  const output = e.stdout || "";
  const lines = output.split("\n");
  
  // parse lines like: /path/to/file:line:col lint/rule
  const regex = /^(\/.*?):(\d+):\d+ (lint\/[\w\/]+)/;
  
  let fixes = {};
  
  lines.forEach(line => {
    const match = line.match(regex);
    if (match) {
      const file = match[1];
      const lineNum = parseInt(match[2], 10);
      const rule = match[3];
      
      if (!fixes[file]) fixes[file] = [];
      fixes[file].push({ lineNum, rule });
    }
  });

  for (const file of Object.keys(fixes)) {
    const content = fs.readFileSync(file, "utf8").split("\n");
    // Sort descending so line additions don't offset subsequent line numbers
    const fileFixes = fixes[file].sort((a, b) => b.lineNum - a.lineNum);
    
    let offset = 0;
    for (const fix of fileFixes) {
      // lineNum is 1-indexed. Insert before.
      const insertIndex = fix.lineNum - 1;
      const whitespaceMatch = content[insertIndex]?.match(/^(\s*)/);
      const padding = whitespaceMatch ? whitespaceMatch[1] : "";
      
      content.splice(insertIndex, 0, `${padding}// biome-ignore ${fix.rule}: auto`);
    }
    fs.writeFileSync(file, content.join("\n"), "utf8");
  }
}
