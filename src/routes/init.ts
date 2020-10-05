import { Response, Request, Router, NextFunction } from 'express';

const router = Router();

const renderIndex = (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (!cookies.token) {
    return res.render('index', {
      title: 'Actual Clients',
      message: 'Hello there!',
    });
  } else {
    return res.render('app', {
      title: 'Init page',
      message: 'Cool!! you are in!! the token was installed',
    });
  }
};

router.get('/', renderIndex);

export default router;
