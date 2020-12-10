import { Router } from 'express';
import userRoutes from '../api/users/router';
import customersRoutes from '../api/customers/router';
import carsRoutes from '../api/cars/router';
import brandsRoutes from '../api/brands/router';
import modelsRoutes from '../api/models/router';
import versionsRoutes from '../api/versions/router';
import categoriesRoutes from '../api/categories/router';
import rolesRoutes from '../api/roles/router';
import carsCategoriesRoutes from '../api/cars_categories/router';
import carsCustomersRoutes from '../api/cars_customers/router';
import usersCustomersRoutes from '../api/users_customers/router';
import unrestrictedRoutes from '../api/unrestricted/router';
import { authentication, authorization } from '../middleware/auth';

const router = Router();

router.use('/users', [authentication], userRoutes);
router.use('/customers', [authentication], customersRoutes);
router.use('/cars', [authentication], carsRoutes);
router.use('/brands', [authentication], brandsRoutes);
router.use('/models', [authentication], modelsRoutes);
router.use('/versions', [authentication], versionsRoutes);
router.use('/categories', [authentication], categoriesRoutes);
router.use('/roles', [authentication], rolesRoutes);
router.use('/cars_categories', [authentication], carsCategoriesRoutes);
router.use('/cars_customers', [authentication], carsCustomersRoutes);
router.use('/users_customers', [authentication], usersCustomersRoutes);
router.use('/', unrestrictedRoutes);

export default router;
