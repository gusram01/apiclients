import { Router } from 'express';
import signup from './routes/signup';
import login from './routes/login';

class IndexRoutes {

  router: Router;

  constructor() {
    this.router = Router();
    this.indexRoutes();
  }

  private indexRoutes() {
    this.router.use('/signup', signup);
    this.router.use('/login', login);
  }

}

const indexRoutes = new IndexRoutes();

export default indexRoutes.router;

