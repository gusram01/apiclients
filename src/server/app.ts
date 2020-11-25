import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import network from '../api/router';
import { errorHandler } from '../network/errorResponse';
import { authentication, authorization } from '../middleware/auth';

const app = express();
const swaggerDoc = require('../swagger.json');

// middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use('/api', authentication, authorization, network);
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Error handler
app.use(errorHandler);

export default app;
