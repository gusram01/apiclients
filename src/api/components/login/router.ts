import { RequestHandler, Router } from 'express';
import { successResponse } from '../../../network/response';
import Controller from './index';

const router = Router();

const login: RequestHandler = (req, res, next) => {
  Controller.login(req.body)
    .then((data: any) => successResponse(req, res, data, 200, true))
    .catch(next);
};
router.post('/', login);
// router.post('/newpassword', forgotPassword);
// router.get('/newpassword/:tokenTemporal', validateTokenTemporal);
// router.put('/newpassword/:tokenTemporal', newPassword);

export default router;
// const validateTokenTemporal: RequestHandler = (req, res, next) => {
//   const tokenTemporal = req.params.tokenTemporal;

//   Controller.findTokenTemporal(tokenTemporal, next)
//     .then((data) => {
//       return res.send(`<h1>ok ${data}, continue</h1>`);
//     })
//     .catch(next);
// };

// const forgotPassword: RequestHandler = (req, res, next) => {
//   const { emailNewPass } = req.body;

//   Controller.getTokenTemporal(emailNewPass, next)
//     .then((data) => {
//       if (!data.ok) throw next(err400);
//       return res.status(200).json({ ...data });
//     })
//     .catch(next);
// };

// const newPassword: RequestHandler = async (req, res, next) => {
//   const { password } = req.body;
//   const tokenTemporal = req.params.tokenTemporal;

//   try {
//     const doc = await Controller.findTokenTemporal(tokenTemporal, next);
//     const encryptPassword = await Controller.encrypter(password);
//     await doc.set('password', encryptPassword).save();
//     await doc.set('resetPassword', undefined).save();
//     await doc.set('resetPaswordExpire', undefined).save();
//     return res.status(200).json({ ok: true, message: 'Password updated' });
//   } catch (error) {
//     throw next(error);
//   }
// };

// const validateRequest: RequestHandler = (req, res, next) => {
//   if (!req.body.email || !req.body.password) return next(err400);
//   if (req.body.password.length < 6) return next(err400);
//   return next();
// };
