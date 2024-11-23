import cron from 'node-cron';
import User from '../models/User.js';
import { queryLeetCodeAPI } from '../config/axios.js';
import { getUserProfileQuery } from '../gqlquery/userQueries.js';

async function updateUserRanking(user) {
  try {
    const data = await queryLeetCodeAPI(getUserProfileQuery, { username: user.username });
    
    if (data?.matchedUser?.profile) {
      const { ranking } = data.matchedUser.profile;
      
      await User.findByIdAndUpdate(user._id, {
        ranking,
        lastUpdated: new Date()
      });
      
      console.log(`Updated ranking for ${user.username}: ${ranking}`);
    }
  } catch (error) {
    console.error(`Failed to update ranking for ${user.username}:`, error);
  }
}

async function updateAllRankings() {
  try {
    console.log('Starting batch ranking update...');
    
    // Get all users
    const users = await User.find({});
    
    // Update rankings with delay between requests to avoid rate limiting
    for (const user of users) {
      await updateUserRanking(user);
      // Add a 1-second delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('Batch ranking update completed');
  } catch (error) {
    console.error('Batch ranking update failed:', error);
  }
}

// Schedule updates to run every 24 hours at midnight
export function startRankingUpdates() {
  // '0 0 * * *' = run at midnight every day
  cron.schedule('0 0 * * *', () => {
    console.log('Running scheduled ranking updates...');
    updateAllRankings();
  });
  
  console.log('Ranking update scheduler started');
}

// Export for manual updates if needed
export { updateAllRankings };