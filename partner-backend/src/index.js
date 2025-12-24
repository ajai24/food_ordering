import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import restaurantRouter from './routes/restaurant.routes.js';
import paymentRouter from './routes/payment.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4100;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'partner-backend' });
});

app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/payments', paymentRouter);

const start = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Partner backend listening on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error('Partner backend failed to start', error);
  process.exit(1);
});
