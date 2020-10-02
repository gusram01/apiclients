import { Router } from 'express';
import signup from './routes/signup';
import login from './routes/login';
import init from './routes/init';

const router = Router();

router.use('/', init);
router.use('/api/signup', signup);
router.use('/api/login', login);

export default router;
