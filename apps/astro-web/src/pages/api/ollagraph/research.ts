export const prerender = false;
import type { APIRoute } from 'astro';
import { ollagraph } from '@/services/ollagraph';

export const GET: APIRoute = async ({ request, url }) => {
  const owner = url.searchParams.get('owner');
  const repo = url.searchParams.get('repo');

  if (!owner || !repo) {
    return new Response(JSON.stringify({ error: 'Missing owner or repo' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const analysis = await ollagraph.analyzeRepository(owner, repo);
    
    // Simulate slight delay for loading state visibility
    await new Promise(resolve => setTimeout(resolve, 800));

    return new Response(JSON.stringify(analysis.deepResearch), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Deep research temporarily unavailable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
