import { createServer } from 'http';
import { handler } from './apps/astro-web/.vercel/output/functions/render.func/index.mjs';

const server = createServer(async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error("CRASH:", err);
    res.statusCode = 500;
    res.end("500");
  }
});
server.listen(4322, () => console.log('Listening on 4322'));
