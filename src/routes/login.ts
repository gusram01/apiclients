import { Response, Request, Router, NextFunction, CookieOptions } from 'express';
import { err403, err400 } from '../middleware/errorResponse';
import UserMiddleware from '../middleware/users';


class Login {
  readonly router: Router;

  constructor() {
    this.router = Router();
    this.routesUsers();
  }

  private validateReq(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    if (!req.body.email || !req.body.password) return next(err400);
    if (req.body.password.length < 6) return next(err400);
    return next();

  }

  private validateReqNewPassword(
    req: Request,
    res: Response,
    next: NextFunction) {
    if (!req.body.email) return next(err400);
    return next();

  }

  private login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    const { email, password } = req.body;
    const cookieOptions: CookieOptions = {
      expires: new Date(Date.now() + +process.env.EXPIN_COOKIEP!),
      httpOnly: true
    };

    UserMiddleware.validatePassword(email, password, next)
      .then(id => {
        if (!id) throw next(err403);

        const token = UserMiddleware.getToken(id);

        return res.status(200)
          .cookie('token', token, cookieOptions)
          .json({ ok: true, data: token });
      })
      .catch(next);

  }

  private forgotPass(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    const { email } = req.body;

    UserMiddleware.getTokenTemporal(email, next)
      .then(data => {
        return res.status(200).json({
          ok: true,
          message: 'Please verify your mailbox',
          data
        });
      })
      .catch(next);

  }

  private routesUsers(): void {
    this.router.post('/', this.validateReq, this.login);
    this.router.post('/newpassword', this.validateReqNewPassword, this.forgotPass);
  }

}

const login = new Login();

export default login.router;