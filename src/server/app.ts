import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import network from '../api/router';
import { errorHandler } from '../network/errorResponse';

const app = express();

// middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use('/api', network);

// Error handler
app.use(errorHandler);

export default app;
