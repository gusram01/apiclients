import { Router } from 'express';
import signup from './routes/signup';
import login from './routes/login';
import init from './routes/init';
import help from './routes/help';

const router = Router();

router.use('/', init);
router.use('/api/signup', signup);
router.use('/api/login', login);
router.use('/api/help', help);

export default router;
