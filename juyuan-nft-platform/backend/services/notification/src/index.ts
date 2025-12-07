import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notification';
import templateRoutes from './routes/template';
import { errorHandler } from './middleware/errorHandler';
import { NotificationQueue } from './services/NotificationQueue';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3008;

// 初始化通知队列
const notificationQueue = new NotificationQueue();
notificationQueue.startProcessing();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'notification-service',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/templates', templateRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});

export default app;

