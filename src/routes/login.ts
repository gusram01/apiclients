import { err403, err400, ErrorResponse } from '../middleware/errorResponse';
import signupLogin from '../middleware/signupLogin';
import {
  Response,
  Request,
  Router,
  NextFunction,
  CookieOptions,
} from 'express';
import {
  encrypter,
  getToken,
  saveToDB,
  validatePassword,
  findTokenTemporal,
  getTokenTemporal,
} from '../middleware/users';

const router = Router();

const validateReq = (req: Request, res: Response, next: NextFunction) => {
  signupLogin(req, next);
};

const validateReqNewPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.emailNewPass) return next(err400);
  return next();
};

const validateTokenTemporal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenTemporal = req.params.tokenTemporal;

  findTokenTemporal(tokenTemporal, next)
    .then((data) => {
      return res.send(`<h1>ok ${data}, continue</h1>`);
    })
    .catch(next);
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + +process.env.EXPIN_COOKIEP!),
    httpOnly: true,
  };

  validatePassword(email, password, next)
    .then((id) => {
      if (!id) throw next(err403);

      const token = getToken(id);
      return res
        .cookie('token', token, cookieOptions)
        .json({ ok: true, data: token });
    })
    .catch(next);
};

const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const { emailNewPass } = req.body;

  getTokenTemporal(emailNewPass, next)
    .then((data) => {
      if (!data!.ok) throw next(err400);
      return res.status(200).json({ ...data });
    })
    .catch(next);
};

const newPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  const tokenTemporal = req.params.tokenTemporal;

  try {
    const doc = await findTokenTemporal(tokenTemporal, next);
    const encryptPassword = await encrypter(password);
    await doc.set('password', encryptPassword).save();
    await doc.set('resetPassword', undefined).save();
    await doc.set('resetPaswordExpire', undefined).save();
    return res.status(200).json({ ok: true, message: 'Password updated' });
  } catch (error) {
    throw next(error);
  }
};

router.post('/', validateReq, login);
router.post('/newpassword', validateReqNewPassword, forgotPassword);
router.get('/newpassword/:tokenTemporal', validateTokenTemporal);
router.put('/newpassword/:tokenTemporal', newPassword);

export default router;
