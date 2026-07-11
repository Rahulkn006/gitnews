import fs from 'fs';
import path from 'path';

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  if (content.includes('useQuery')) {
    // Replace convex imports
    content = content.replace(/import \{ api \} from ["']@v1\/backend\/convex\/_generated\/api["'];?\n?/g, '');
    content = content.replace(/import \{ useQuery \} from ["']convex\/react["'];?\n?/g, 'import useSWR from "swr";\nimport { fetcher } from "@/lib/fetcher";\n');

    // Replace getLatestRepos
    content = content.replace(/const dbRepos = useQuery\(api\.github\.getLatestRepos\);/g, 'const { data: dbRepos } = useSWR("/api/repositories", fetcher);');
    // Replace getReposByCategory
    content = content.replace(/const dbRepos = useQuery\(api\.github\.getReposByCategory, \{ category: "(.*?)" \}\);/g, 'const { data: dbRepos } = useSWR("/api/repositories?category=$1", fetcher);');
    // Replace getFeaturedRepos
    content = content.replace(/const dbFeatured = useQuery\(api\.github\.getFeaturedRepos\);/g, 'const { data: dbFeatured } = useSWR("/api/repositories?featured=true", fetcher);');
    // Replace getLatestRepos again if assigned to dbLatest
    content = content.replace(/const dbLatest = useQuery\(api\.github\.getLatestRepos\);/g, 'const { data: dbLatest } = useSWR("/api/repositories", fetcher);');
    
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(process.cwd(), 'apps/web/src/app'));
