import { Router, RequestHandler } from 'express';

const router = Router();

const homePage: RequestHandler = (req, res, next) => {
  return res.render('index');
};

const signUp: RequestHandler = (req, res, next) => {
  return res.render('signup', {
    title: 'Sign Up Page',
  });
};

router.get('/', homePage);
router.get('/signup', signUp);

export default router;
