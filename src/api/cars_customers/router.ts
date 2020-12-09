import Controller from './index';
import { RequestHandler, Router } from 'express';
import { successResponse } from '../../network/successResponse';
import { check } from 'express-validator';
import { validationFields } from '../../middleware/validationFields';

const router = Router();

const some: RequestHandler = (req, res, next) => {
  Controller.some(req)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const one: RequestHandler = (req, res, next) => {
  Controller.findById(req)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const create: RequestHandler = (req, res, next) => {
  Controller.create(req)
    .then((data: any) => successResponse(req, res, data, 201))
    .catch(next);
};

const update: RequestHandler = (req, res, next) => {
  Controller.updateById(req)
    .then((data: any) => {
      successResponse(req, res, data, 200);
    })
    .catch(next);
};

const remove: RequestHandler = (req, res, next) => {
  Controller.deleteById(req)
    .then((data: any) =>
      successResponse(req, res, { ...data, message: 'Registry erased' }, 200)
    )
    .catch(next);
};

router.get('/', some);
router.get('/:id', one);
router.post(
  '/',
  [
    check('cars_id', 'cars_id is Required').notEmpty(),
    check('customers_id', 'customers_id is Required').notEmpty(),
    validationFields,
  ],
  create
);
router.put(
  '/:id',
  [check('_id', 'Id not editable').not().exists(), validationFields],
  update
);
router.delete('/:id', remove);

export default router;
