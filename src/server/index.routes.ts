import { Router } from 'express';
import views from '../web/router';
import users from '../api/components/users/router';
import login from '../api/components/login/router';

const router = Router();

router.use('/', views);
router.use('/api/users', users);
router.use('/api/login', login);

export default router;
