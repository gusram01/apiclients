import { Response, Request, Router, NextFunction, CookieOptions } from 'express';
import { ErrorResponse } from '../errors/errorResponse';
import Persons from '../../middleware/persons/persons.midd';

class RoutesLogin {

  router: Router;

  constructor() {
    this.router = Router();
    this.routesUsers();
  }

  private async postLogin(req: Request, res: Response, next: NextFunction) {

    const { email, password } = req.body;

    if (!email || !password) return next(new ErrorResponse(400, `Email / Password is required`));
    try {
      const docFound = await Persons.findOne({ email: email }).select('+password');
      if (!docFound) return next(new ErrorResponse(401, `Invalid Email / Password`));
      //@ts-ignore
      if (docFound.category === 'CLIENT') return next(new ErrorResponse(401, `Invalid Email / Password`));
      //@ts-ignore
      const validation = await docFound.validateSign(password);
      console.log(validation);
      if (!validation) return next(new ErrorResponse(401, `Invalid Email / Password`));

      //@ts-ignore
      const token = await docFound.getSignJWT();

      const cookieOptions: CookieOptions = {
        expires: new Date(Date.now() + +process.env.EXPIN_COOKIEP!),
        httpOnly: true
      }

      return res
        .status(200)
        .cookie('token', token, cookieOptions)
        .json({ ok: true, token });

    } catch (error) {
      next(new ErrorResponse(400, `something wrong: ${error}`));
    }

  }

  private routesUsers(): void {
    this.router.post('/', this.postLogin);
  }

}

const Login = new RoutesLogin();

export default Login.router;