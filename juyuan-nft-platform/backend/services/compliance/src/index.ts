import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import kycRoutes from './routes/kyc';
import amlRoutes from './routes/aml';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3007;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'compliance-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/kyc', kycRoutes);
app.use('/api/v1/aml', amlRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Compliance Service running on port ${PORT}`);
});

export default app;

