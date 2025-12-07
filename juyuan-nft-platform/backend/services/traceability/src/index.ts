import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import traceRoutes from './routes/trace';
import eventRoutes from './routes/event';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3005;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'traceability-service',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/trace', traceRoutes);
app.use('/api/v1/events', eventRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Traceability Service running on port ${PORT}`);
});

export default app;

