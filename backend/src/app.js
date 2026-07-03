import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './modules/auth/auth.routes.js';
import studentRoutes from './modules/students/student.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import superAdminRoutes from './modules/super-admin/superAdmin.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestContext } from './middleware/requestContext.js';
import { activityTracker } from './middleware/activityTracker.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(requestContext);
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'PG Management API is healthy' }));
app.use('/api/auth', authRoutes);
app.use('/api/student', activityTracker, studentRoutes);
app.use('/api/admin', activityTracker, adminRoutes);
app.use('/api/super-admin', activityTracker, superAdminRoutes);

app.use(notFound);
app.use(errorHandler);
