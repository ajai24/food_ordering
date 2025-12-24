import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import orderRouter from './routes/order.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'customer-backend' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);

const start = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Customer backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.log('⚠️ Starting server without database connection...');
    app.listen(PORT, () => {
      console.log(`Customer backend listening on port ${PORT} (DB connection failed)`);
    });
  }
};

start();
