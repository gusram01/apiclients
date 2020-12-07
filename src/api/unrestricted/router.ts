import Controller from './index';
import { RequestHandler, Router } from 'express';
import { successResponse } from '../../network/successResponse';
import { check } from 'express-validator';
import { validationFields } from '../../middleware/validationFields';

const router = Router();

const unique: RequestHandler = (req, res, next) => {
  Controller.isValid(req)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const login: RequestHandler = (req, res, next) => {
  Controller.login(req)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};
const signup: RequestHandler = (req, res, next) => {
  Controller.signup(req)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

router.get('/validate/:key/:value', unique);
router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').notEmpty(),
    check('password', 'Password with at least 6 characters').isLength({
      min: 6,
    }),
    validationFields,
  ],
  login
);
router.post(
  '/signup',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').notEmpty(),
    check('password', 'Password with at least 6 characters').isLength({
      min: 6,
    }),
    validationFields,
  ],
  signup
);

export default router;
