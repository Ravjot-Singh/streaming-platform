import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import channelRoutes from './routes/channel.routes.js';
import streamRoutes from './routes/stream.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
 
app.get('/health', (req, res) => res.json({ status: 'ok' }));
 
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/stream' , streamRoutes);
 
app.use(errorHandler);
 
export default app;
 