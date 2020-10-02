import { Response, Request, Router, NextFunction } from 'express';

interface Params {
  req: Request;
  res: Response;
  next: NextFunction;
}

const router = Router();

const renderIndex = ({ req, res, next }: Params) => {
  res.render('index', { title: 'Actual Clients', message: 'Hello there!' });
};

router.get('/', renderIndex);

export default router;
