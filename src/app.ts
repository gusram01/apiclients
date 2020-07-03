import express from 'express';
import helmet from 'helmet';
import mongoose, { Error } from 'mongoose';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/error.Handler';
import Login from './classes/routes/login.routes';
import Signup from './classes/routes/register.routes';
// import { accessMiddle } from './middleware/auth';


export default class App {
  protected app: express.Application;
  protected port: number;
  protected publicPath = path.resolve(__dirname, '../public');

  constructor(puerto: number) {
    this.port = +process.env.PORT! || puerto;
    this.app = express();
    this.intermediarios();
    this.routes();
    this.app.use(errorHandler);
  }

  private intermediarios() {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(cookieParser());
  }

  private routes() {
    this.app.use('/', express.static(this.publicPath));
    this.app.use('/api/signup', Signup);
    this.app.use('/api/login', Login);
  }

  private async mongDb() {
    try {
      const respuesta = await mongoose.connect(process.env.MONGO_URL!, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });
      return respuesta;
    } catch (err) {
      throw new Error('Error on mongoose.connect: ' + err);
    }
  }

  public static init(puerto: number) { return new App(puerto) }

  public async start() {
    try {
      await this.app.listen(this.port);
      console.log('Server listening on port ', this.port);
      await this.mongDb();
      console.log('Base de datos online');
    } catch (err) {
      return console.warn(err);
    }
  }

}