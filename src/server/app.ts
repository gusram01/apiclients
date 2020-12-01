import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import router from '../api/router';
import { errorHandler } from '../network/errorResponse';
import { authentication, authorization } from '../middleware/auth';

interface ReqUser {
  id: string;
  email: string;
  roles: string;
}

export class MyContext {
  private _id: string;
  private _email: string;
  private _roles: string;
  private _iat: number;
  private _exp: number;

  constructor(
    id: string,
    email: string,
    roles: string,
    iat: number,
    exp: number
  ) {
    this._id = id;
    this._email = email;
    this._roles = roles;
    this._iat = iat;
    this._exp = exp;
  }

  public get id(): string {
    return this._id;
  }
  public get email(): string {
    return this._email;
  }
  public get roles(): string {
    return this._roles;
  }
  public get iat(): number {
    return this._iat;
  }
  public get exp(): number {
    return this._exp;
  }
}

declare global {
  namespace Express {
    interface Request {
      user: MyContext;
    }
  }
}

const app = express();
const swaggerDoc = require('../swagger.json');

// middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use('/api', authentication, authorization, router);
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Error handler
app.use(errorHandler);

export default app;
