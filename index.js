import { app } from './app.js';
import connectDB from './db/index.js';
import { startRankingUpdates } from './jobs/updateRankings.js';

const PORT = process.env.PORT || 8000;

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
    
    // Start the cron job for ranking updates
    startRankingUpdates();
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });