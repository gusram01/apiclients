import Controller from './index';
import { RequestHandler, Router } from 'express';
import { successResponse } from '../network/successResponse';

const router = Router();

const list: RequestHandler = async (req, res, next) => {
  Controller.getAll(req.params.table)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const one: RequestHandler = (req, res, next) => {
  Controller.getOne(req.params.table, req.params.id)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const newOne: RequestHandler = (req, res, next) => {
  Controller.newOne(req.params.table, req.body)
    .then((data: any) => successResponse(req, res, data, 201))
    .catch(next);
};

const update: RequestHandler = (req, res, next) => {
  Controller.updateOne(req.params.table, req.params.id, req.body)
    .then((data: any) => {
      successResponse(req, res, data, 200);
    })
    .catch(next);
};

const remove: RequestHandler = (req, res, next) => {
  Controller.delOne(req.params.table, req.params.id)
    .then((data: any) =>
      successResponse(req, res, { data, message: 'Registry erased' }, 200)
    )
    .catch(next);
};

const some: RequestHandler = (req, res, next) => {
  console.log(req.query);
  Controller.getSome(req.params.table, req.query)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

router.get('/:table/find', some);
router.get('/:table', list);
router.get('/:table/:id', one);
router.post('/:table', newOne);
router.put('/:table/:id', update);
router.delete('/:table/:id', remove);

export default router;
