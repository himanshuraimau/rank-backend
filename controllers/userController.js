import User from '../models/User.js';
import { queryLeetCodeAPI } from '../config/axios.js';
import { getUserProfileQuery } from '../gqlquery/userQueries.js';

export const getUserRanking = async (req, res) => {
  const { username } = req.params;

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let user = await User.findOne({
      username,
      updatedAt: { $gt: twentyFourHoursAgo }
    });

    if (!user) {
      const data = await queryLeetCodeAPI(getUserProfileQuery, { username });

      if (!data.matchedUser || !data.matchedUser.profile) {
        return res.status(404).json({ 
          error: 'User not found on LeetCode or no ranking available' 
        });
      }

      const { ranking } = data.matchedUser.profile;

      user = await User.findOneAndUpdate(
        { username },
        { 
          username,
          ranking,
          lastUpdated: new Date()
        },
        { 
          upsert: true, 
          new: true,
          runValidators: true
        }
      );

      console.log(`User ${username} ${user.isNew ? 'created' : 'updated'} with ranking ${ranking}`);
    }

    res.json({
      username: user.username,
      ranking: user.ranking,
      lastUpdated: user.updatedAt
    });

  } catch (error) {
    console.error(`Error processing request for username ${username}:`, error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};