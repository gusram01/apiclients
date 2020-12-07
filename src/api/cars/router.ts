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
    check('brands_id', 'brands_id is Required').notEmpty(),
    check('brands_id', 'brands_id must be number').isNumeric(),
    check('models_id', 'models_id is Required').notEmpty(),
    check('models_id', 'models_id must be number').isNumeric(),
    check('versions_id', 'versions_id is Required').notEmpty(),
    check('versions_id', 'versions_id must be number').isNumeric(),
    check('year', 'Year is required').notEmpty(),
    check('Price', 'Price is required').notEmpty(),
    check('Price', 'Price must be number').isNumeric(),
    validationFields,
  ],
  create
);
router.put(
  '/:id',
  [
    check('_id', '_id not editable').not().exists(),
    check('created_at', 'created_at not editable').not().exists(),
    check('active', 'active not editable').not().exists(),
    validationFields,
  ],
  update
);
router.delete('/:id', remove);

export default router;
