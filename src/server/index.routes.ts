import { Router } from 'express';
import views from '../web/router';
import cars from '../api/components/cars/router';
import users from '../api/components/users/router';
import login from '../api/components/login/router';
import brands from '../api/components/brands/router';
import brandModel from '../api/components/brandmodel/router';
import categories from '../api/components/cars_categories/router';
import models from '../api/components/models/router';
import versions from '../api/components/versions/router';
import customers from '../api/components/customers/router';
import operations from '../api/components/operations/router';

const router = Router();

router.use('/', views);
router.use('/api/cars', cars);
router.use('/api/login', login);
router.use('/api/users', users);
router.use('/api/brands', brands);
router.use('/api/categories', categories);
router.use('/api/models', models);
router.use('/api/versions', versions);
router.use('/api/bm', brandModel);
router.use('/api/customers', customers);
router.use('/api/operations', operations);

export default router;
