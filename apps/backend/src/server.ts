import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import repositoriesRoutes from './routes/repositories.routes';
import aiRoutes from './routes/ai.routes';
import { startScheduler } from './scheduler/githubSync';
import { GitHubService } from './services/github.service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/repositories', repositoriesRoutes);
app.use('/api/ai', aiRoutes);

app.post('/api/sync/github', async (req, res) => {
  try {
    // Run sync in background
    GitHubService.syncGitHubData().catch(console.error);
    res.json({ message: 'GitHub Sync started' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start sync' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

startScheduler();

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
