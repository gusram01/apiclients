import { Router, RequestHandler } from 'express';

const router = Router();

const homePage: RequestHandler = (req, res, next) => {
  return res.render('index');
};

const app: RequestHandler = (req, res, next) => {
  return res.render('app', {
    title: 'App',
    h1: 'Yeeeeyy !!!',
  });
};

router.get('/', homePage);
router.get('/app', app);

export default router;
