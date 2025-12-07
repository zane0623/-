import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import currencyRoutes from './routes/currency';
import { CurrencyService } from './services/CurrencyService';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3010;

// 初始化汇率更新任务
const currencyService = new CurrencyService();
currencyService.startRateUpdater();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'currency-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/currency', currencyRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Currency Service running on port ${PORT}`);
});

export default app;

