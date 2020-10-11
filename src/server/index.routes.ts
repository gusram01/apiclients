import { Router } from 'express';
import home from '../homepage/router';
import users from '../api/components/users/router';

const router = Router();

router.use('/', home);
router.use('/api/users', users);

export default router;
