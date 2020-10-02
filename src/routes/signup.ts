import { Response, Request, NextFunction, Router } from 'express';
import { err400 } from '../middleware/errorResponse';
import { saveToDB } from '../middleware/users';

interface Params {
  req: Request;
  res: Response;
  next: NextFunction;
}

const router = Router();

const validateRequest = ({ req, res, next }: Params) => {
  if (!req.body.email || !req.body.password) return next(err400);
  if (req.body.password.length < 6) return next(err400);
  return next();
};

const newUser = ({ req, res, next }: Params) => {
  saveToDB(req, next)
    .then((data) => res.status(201).json({ ok: true, data }))
    .catch(next);
};

router.post('/new', validateRequest, newUser);

export default router;
