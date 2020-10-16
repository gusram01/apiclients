import { Router, RequestHandler } from 'express';

const router = Router();

const homePage: RequestHandler = (req, res, next) => {
  return res.render('index');
};

const signUp: RequestHandler = (req, res, next) => {
  return res.render('signup', {
    title: 'Sign Up Page',
    items: [
      { id: 'nickname', type: 'text' },
      { id: 'email', type: 'email' },
      { id: 'password', type: 'password' },
      { id: 'verify', type: 'password' },
    ],
    endpoint: '/api/users',
    btnLabel: 'Sign Up',
  });
};

const logIn: RequestHandler = (req, res, next) => {
  return res.render('login', {
    title: 'LogIn Page',
    items: [
      { id: 'email', type: 'email' },
      { id: 'password', type: 'password' },
    ],
    endpoint: '/api/login',
    btnLabel: 'LogIn',
  });
};

const forgot: RequestHandler = (req, res, next) => {
  return res.render('login', {
    title: 'New Password',
    items: [{ id: 'email', type: 'email' }],
    endpoint: '/api/login/newpassword',
    btnLabel: 'New Password',
  });
};

router.get('/', homePage);
router.get('/signup', signUp);
router.get('/login', logIn);
router.get('/forgot', forgot);

export default router;
