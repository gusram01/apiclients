import { Response, Request, Router, NextFunction } from 'express';

const router = Router();

const renderIndex = (req: Request, res: Response, next: NextFunction) => {
  res.render('help', { title: 'Api Documentation', message: 'Documentation' });
};

router.get('/', renderIndex);

export default router;
