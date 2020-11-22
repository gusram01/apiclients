import { Router } from 'express';
import views from '../web/router';
import network from '../api/router';

const router = Router();

router.use('/', views);
router.use('/api/cars', network);
router.use('/api/login', network);
router.use('/api/users', network);
router.use('/api/brands', network);
router.use('/api/categories', network);
router.use('/api/models', network);
router.use('/api/versions', network);
router.use('/api/brand_model', network);
router.use('/api/customers', network);
router.use('/api/operations', network);
router.use('/api/user_types', network);

export default router;
