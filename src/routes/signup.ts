import { Response, Request, NextFunction, Router } from 'express';
import { err400 } from '../middleware/errorResponse';
import UserMiddleware from '../middleware/users';


class Signup {
  readonly router: Router;

  constructor() {
    this.router = Router();
    this.routesSignup();
  }

  private validateRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    if (!req.body.email || !req.body.password) return next(err400);
    if (req.body.password.length < 6) return next(err400);
    return next();

  }

  private newUser(
    req: Request,
    res: Response,
    next: NextFunction) {

    UserMiddleware.saveToDB(req, next)
      .then(data => res.status(201).json({ ok: true, data }))
      .catch(next)

  }

  private routesSignup() {
    this.router.post('/new', this.validateRequest, this.newUser);
  }

}

const signup = new Signup();

export default signup.router;