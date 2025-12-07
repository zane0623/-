import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import translationRoutes from './routes/translation';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3009;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'i18n-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/i18n', translationRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`🚀 i18n Service running on port ${PORT}`);
});

export default app;

