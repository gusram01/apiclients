import { err403, err400, ErrorResponse } from '../middleware/errorResponse';
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

interface Params {
  req: Request;
  res: Response;
  next: NextFunction;
}

const router = Router();

const validateReq = ({ req, res, next }: Params) => {
  if (!req.body.email || !req.body.password) return next(err400);
  if (req.body.password.length < 6) return next(err400);
  return next();
};

const validateReqNewPassword = ({ req, res, next }: Params) => {
  if (!req.body.email) return next(err400);
  return next();
};

const validateTokenTemporal = ({ req, res, next }: Params) => {
  const tokenTemporal = req.params.tokenTemporal;

  findTokenTemporal(tokenTemporal, next)
    .then((data) => {
      return res.send(`<h1>ok ${data}, continue</h1>`);
    })
    .catch(next);
};

const login = ({ req, res, next }: Params) => {
  const { email, password } = req.body;
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + +process.env.EXPIN_COOKIEP!),
    httpOnly: true,
  };

  validatePassword(email, password, next)
    .then((id) => {
      if (!id) throw next(err403);

      const token = getToken(id);

      return res.cookie('token', token, cookieOptions).render('app', {
        title: 'Init page',
        message: 'Cool!! you are in!!',
      });

      // res.status(200)
      //   .cookie('token', token, cookieOptions)
      //   .json({ ok: true, data: token });
    })
    .catch(next);
};

const forgotPassword = ({ req, res, next }: Params) => {
  const { email } = req.body;

  getTokenTemporal(email, next)
    .then((data) => {
      return res.status(200).json({
        ok: true,
        message: 'Please verify your mailbox',
        data,
      });
    })
    .catch(next);
};

const newPassword = async ({ req, res, next }: Params) => {
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
