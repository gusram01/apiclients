import { Router } from 'express';
import userRoutes from '../api/users/router';
import customersRoutes from '../api/customers/router';
import carsRoutes from '../api/cars/router';
import genericRoutes from '../api/generic/router';
import carsCategoriesRoutes from '../api/cars_categories/router';
import carsCustomersRoutes from '../api/cars_customers/router';
import usersCustomersRoutes from '../api/users_customers/router';
import unrestrictedRoutes from '../api/unrestricted/router';
import { authentication, authorization } from '../middleware/auth';

const router = Router();

router.use('/users', [authentication], userRoutes);
router.use('/customers', [authentication], customersRoutes);
router.use('/cars', [authentication], carsRoutes);
router.use('/brands', [authentication], genericRoutes);
router.use('/models', [authentication], genericRoutes);
router.use('/versions', [authentication], genericRoutes);
router.use('/categories', [authentication], genericRoutes);
router.use('/roles', [authentication], genericRoutes);
router.use('/cars_categories', [authentication], carsCategoriesRoutes);
router.use('/cars_customers', [authentication], carsCustomersRoutes);
router.use('/users_customers', [authentication], usersCustomersRoutes);
router.use('/', unrestrictedRoutes);

export default router;
