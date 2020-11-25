import Controller from './index';
import { RequestHandler, Router } from 'express';
import { successResponse } from '../network/successResponse';

const router = Router();

const list: RequestHandler = async (req, res, next) => {
  Controller.getAll(req)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const one: RequestHandler = (req, res, next) => {
  Controller.getOne(req)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const newOne: RequestHandler = (req, res, next) => {
  Controller.newOne(req)
    .then((data: any) => successResponse(req, res, data, 201))
    .catch(next);
};

const update: RequestHandler = (req, res, next) => {
  Controller.updateOne(req)
    .then((data: any) => {
      successResponse(req, res, data, 200);
    })
    .catch(next);
};

const remove: RequestHandler = (req, res, next) => {
  Controller.delOne(req)
    .then((data: any) =>
      successResponse(req, res, { data, message: 'Registry erased' }, 200)
    )
    .catch(next);
};

const some: RequestHandler = (req, res, next) => {
  Controller.getSome(req)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const login: RequestHandler = (req, res, next) => {
  Controller.login(req)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

router.post('/login', login);
router.get('/:table/find', some);
router.get('/:table', list);
router.get('/:table/:id', one);
router.post('/:table', newOne);
router.put('/:table/:id', update);
router.delete('/:table/:id', remove);

export default router;
