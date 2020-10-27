import Controller from './index';
import { RequestHandler, Router } from 'express';
import { successResponse } from '../../../network/successResponse';

const router = Router();

const list: RequestHandler = async (req, res, next) => {
  Controller.getAll()
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const one: RequestHandler = (req, res, next) => {
  Controller.getOne(req.params.id)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const newOne: RequestHandler = (req, res, next) => {
  Controller.newUser(req.body)
    .then((data: any) => successResponse(req, res, data, 201))
    .catch(next);
};

const update: RequestHandler = (req, res, next) => {
  Controller.updateUser(req.params.id, req.body)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const remove: RequestHandler = (req, res, next) => {
  Controller.delUser(req.params.id)
    .then((data: any) =>
      successResponse(req, res, { data, message: 'User erased' }, 200)
    )
    .catch(next);
};

router.get('/', list);
router.get('/:id', one);
router.post('/', newOne);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
