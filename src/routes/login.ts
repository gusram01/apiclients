import { Response, Request, Router, NextFunction, CookieOptions } from 'express';
import { err403, err400, ErrorResponse } from '../middleware/errorResponse';
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

  private validateTokenTemporal(
    req: Request,
    res: Response,
    next: NextFunction) {

    const tokenTemporal = req.params.tokenTemporal;

    UserMiddleware.findTokenTemporal(tokenTemporal, next)
      .then(data => {
        return res.send(`<h1>ok ${data}, continue</h1>`);
      })
      .catch(next)

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

  private forgotPassword(
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

  private async newPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { password } = req.body;
    const tokenTemporal = req.params.tokenTemporal;

    try {
      const doc = await UserMiddleware.findTokenTemporal(tokenTemporal, next);
      const encryptPassword = await UserMiddleware.encrypter(password)
      await doc.set('password', encryptPassword).save();
      await doc.set('resetPassword', undefined).save();
      await doc.set('resetPaswordExpire', undefined).save();
      return res.status(200)
        .json({ ok: true, message: 'Password updated' });

    } catch (error) { throw next(error) }

  }


  private routesUsers(): void {
    this.router.post('/', this.validateReq, this.login);
    this.router.post('/newpassword', this.validateReqNewPassword, this.forgotPassword);
    this.router.get('/newpassword/:tokenTemporal', this.validateTokenTemporal);
    this.router.put('/newpassword/:tokenTemporal', this.newPassword);
  }

}

const login = new Login();

export default login.router;