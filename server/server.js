import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { initRealtime, startRealtimeLoops } from './services/realtimeService.js';
import createApp from './app.js';

dotenv.config();
connectDB();

// Configure CORS so credentialed requests from the client aren't rejected
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const app = createApp({ allowedOrigins });

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

initRealtime(server, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    credentials: true
  }
});
startRealtimeLoops({
  liveUserIntervalMs: Number(process.env.LIVE_USERS_POLL_MS || 30000)
});

server.listen(PORT, () => {
  console.log(`🚀 NeighborFit Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
