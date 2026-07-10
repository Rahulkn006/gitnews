import cron from 'node-cron';
import { GitHubService } from '../services/github.service';

export function startScheduler() {
  // Run every 1 hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running GitHub Sync Job');
    try {
      await GitHubService.syncGitHubData();
      console.log('GitHub Sync completed successfully');
    } catch (error) {
      console.error('GitHub Sync failed', error);
    }
  });
  console.log('Scheduler initialized');
}
