import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import indexRoutes from './index.routes';
import connect from './database';
import { ErrorResponse } from './middleware/errorResponse';

const app = express();

// middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(cookieParser());

// Routes
app.use(express.static(__dirname + '/public'));
app.use('/', indexRoutes);

// template engine
app.set('views', './views');
app.set('view engine', 'pug');

// Error handler
app.use(ErrorResponse.errHandler);

// Database
connect()
  .then(() => console.log('DB online'))
  .catch(console.log);

export default app;
