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
    check('curp', 'CURP is required').toUpperCase().notEmpty(),
    check('curp', 'CURP with 18 characters').isLength({
      min: 18,
      max: 18,
    }),
    check('firstname', 'FirstName is required').notEmpty(),
    check('firstname', 'FirstName with max 34 characters').isLength({
      max: 34,
    }),
    check('lastname', 'LastName is required').notEmpty(),
    check('lastname', 'LastName with max 48 characters').isLength({
      max: 48,
    }),
    check('mobile', 'Mobile phone is required').notEmpty(),
    check('mobile', 'Mobile phone with 10 characters').isLength({
      min: 8,
      max: 10,
    }),
    check('gender', 'MALE / FEMALE only').custom((value) =>
      ['MALE', 'FEMALE'].includes(value)
    ),
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
