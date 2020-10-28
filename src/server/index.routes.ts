import { Router } from 'express';
import views from '../web/router';
import users from '../api/components/users/router';
import customers from '../api/components/customers/router';
import login from '../api/components/login/router';

const router = Router();

router.use('/', views);
router.use('/api/users', users);
router.use('/api/customers', customers);
router.use('/api/login', login);

export default router;
