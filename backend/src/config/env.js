import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/om_sai_pg',
  jwtSecret: process.env.JWT_SECRET || 'dev_only_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_only_refresh_secret_change_me',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
};
