import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/seatsync',

  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Anti-hoarding config
  AWAY_MAX_MINUTES: parseInt(process.env.AWAY_MAX_MINUTES, 10) || 20,
  PRESENCE_CHECK_INTERVAL_HOURS: parseInt(process.env.PRESENCE_CHECK_INTERVAL_HOURS, 10) || 2,
  PRESENCE_GRACE_MINUTES: parseInt(process.env.PRESENCE_GRACE_MINUTES, 10) || 15,
};

export default env;
