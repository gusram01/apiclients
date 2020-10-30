import Controller from './index';
import { RequestHandler, Router } from 'express';
import { successResponse } from '../network/successResponse';

const router = Router();

const list: RequestHandler = async (req, res, next) => {
  Controller.getAll(req.baseUrl.split('/')[2])
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const one: RequestHandler = (req, res, next) => {
  Controller.getOne(req.baseUrl.split('/')[2], req.params.id)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const newOne: RequestHandler = (req, res, next) => {
  Controller.newOne(req.baseUrl.split('/')[2], req.body)
    .then((data: any) => successResponse(req, res, data, 201))
    .catch(next);
};

const update: RequestHandler = (req, res, next) => {
  Controller.updateOne(req.baseUrl.split('/')[2], req.params.id, req.body)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const remove: RequestHandler = (req, res, next) => {
  Controller.delOne(req.baseUrl.split('/')[2], req.params.id)
    .then((data: any) =>
      successResponse(req, res, { data, message: 'Registry erased' }, 200)
    )
    .catch(next);
};

const some: RequestHandler = (req, res, next) => {
  Controller.getSome(req.baseUrl.split('/')[2], req.query)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

router.get('/find/', some);
router.get('/', list);
router.get('/:id', one);
router.post('/', newOne);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
