import { Response, Request, Router, NextFunction } from 'express';

const router = Router();

const renderIndex = (req: Request, res: Response, next: NextFunction) => {
  res.render('index', { title: 'Actual Clients', message: 'Hello there!' });
};

router.get('/', renderIndex);

export default router;
