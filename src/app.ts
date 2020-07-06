import express from 'express';
import helmet from 'helmet';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import indexRoutes from './index.routes';
import DataBase from './database';
import { ErrorResponse } from './middleware/errorResponse';

export default class App {
  protected app: express.Application;
  protected port: number;
  protected publicPath = path.resolve(__dirname, '../public');

  constructor(port: number) {
    this.port = +process.env.PORT! || port;
    this.app = express();
    this.intermediarios();
    this.routes();
    this.app.use(ErrorResponse.errHandler);
  }

  private intermediarios() {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(cookieParser());
  }

  private routes() {
    this.app.use('/', express.static(this.publicPath));
    this.app.use('/api', indexRoutes);
  }

  private connectDB() {
    DataBase.connect()
      .then(() => console.log('DB online'))
      .catch(console.log);
  }

  public static init(port: number) { return new App(port) }

  public start() {
    this.connectDB();
    this.app.listen(this.port, () =>
      console.log('Server listening on port ', this.port));
  }

}