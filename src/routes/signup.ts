import { Response, Request, NextFunction, Router } from 'express';
import { err400 } from '../middleware/errorResponse';
import { saveToDB } from '../middleware/users';

const router = Router();

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.email || !req.body.password) return next(err400);
  if (req.body.password.length < 6) return next(err400);
  return next();
};

const newUser = (req: Request, res: Response, next: NextFunction) => {
  saveToDB(req, next)
    .then((data) => res.status(201).json({ ok: true, data }))
    .catch(next);
};

router.post('/new', validateRequest, newUser);

export default router;
