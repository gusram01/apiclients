import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import indexRoutes from './index.routes';
import { errorHandler } from '../network/errorResponse';

const app = express();

// middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use(express.static(path.join(__dirname, '..', '..', '/public')));
app.use('/', indexRoutes);

// template engine
app.set('views', './views');
app.set('view engine', 'pug');

// Error handler
app.use(errorHandler);

export default app;
