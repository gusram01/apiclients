// import signupLogin from '../../../middleware/signupLogin';
// import { RequestHandler, Router, CookieOptions } from 'express';
// import Controller from './index';
// import { err400 } from '../../../middleware/errorResponse';
// import { errorResponse, successResponse } from '../../../network/response';

// const router = Router();

// const validateReq: RequestHandler = (req, res, next) => {
//   signupLogin(req, next);
// };

// const validateTokenTemporal: RequestHandler = (req, res, next) => {
//   const tokenTemporal = req.params.tokenTemporal;

//   Controller.findTokenTemporal(tokenTemporal, next)
//     .then((data) => {
//       return res.send(`<h1>ok ${data}, continue</h1>`);
//     })
//     .catch(next);
// };

// const login: RequestHandler = (req, res, next) => {
//   const { email, password } = req.body;
//   const cookieOptions: CookieOptions = {
//     expires: new Date(Date.now() + +process.env.EXPIN_COOKIEP!),
//     httpOnly: true,
//   };

//   Controller.validatePassword(email, password, next)
//     .then((id) => {
//       if (!id) throw next(new Error('error '));

//       const token = Controller.getToken(id);
//       return res
//         .cookie('token', token, cookieOptions)
//         .json({ ok: true, data: token });
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

// router.post('/login', login);
// router.post('/newpassword', forgotPassword);
// router.get('/newpassword/:tokenTemporal', validateTokenTemporal);
// router.put('/newpassword/:tokenTemporal', newPassword);

// export default router;
