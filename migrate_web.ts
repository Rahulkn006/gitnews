import fs from 'fs';
import path from 'path';

const WEB_APP_DIR = path.join(process.cwd(), 'apps/web/src/app');

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Replace imports
  if (content.includes('import { api } from "@v1/backend/convex/_generated/api";')) {
    content = content.replace(
      /import { api } from "@v1\/backend\/convex\/_generated\/api";\nimport { useQuery } from "convex\/react";/g,
      'import { fetcher } from "@/lib/fetcher";\nimport useSWR from "swr";'
    );
    changed = true;
  } else if (content.includes('import { useQuery } from "convex/react";')) {
    content = content.replace(
      /import { useQuery } from "convex\/react";/g,
      'import { fetcher } from "@/lib/fetcher";\nimport useSWR from "swr";'
    );
    // Might need to remove `api` import if it was separate
    content = content.replace(/import { api } from "@v1\/backend\/convex\/_generated\/api";\n/g, '');
    changed = true;
  }

  // Replace queries
  if (content.includes('useQuery(api.github.getTrendingRepos)')) {
    content = content.replace(
      /const ([\w]+) = useQuery\(api\.github\.getTrendingRepos\);/g,
      'const { data: $1 } = useSWR("http://localhost:3001/api/repositories", fetcher);'
    );
    changed = true;
  }
  
  if (content.includes('useQuery(api.news.getNews)')) {
    content = content.replace(
      /const ([\w]+) = useQuery\(api\.news\.getNews\);/g,
      'const { data: $1 } = useSWR("http://localhost:3001/api/news", fetcher);'
    );
    changed = true;
  }

  // Repo details page
  if (content.includes('useQuery(api.repositories.getRepoDetails')) {
    content = content.replace(
      /const ([\w]+) = useQuery\(api\.repositories\.getRepoDetails, { owner, name: repoName }\);/g,
      'const { data: $1 } = useSWR(`http://localhost:3001/api/repositories/${owner}/${repoName}`, fetcher);'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function traverse(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

traverse(WEB_APP_DIR);
