import Controller from './index';
import { RequestHandler, Router, CookieOptions } from 'express';
import { successResponse } from '../../../network/response';

const router = Router();

const list: RequestHandler = async (req, res, next) => {
  Controller.getAll()
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const one: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  Controller.getOne(id)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const newOne: RequestHandler = (req, res, next) => {
  const body = req.body;
  Controller.postOne(body, next)
    .then((data: any) => successResponse(req, res, data, 201))
    .catch(next);
};

const update: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  Controller.updateOne(id, body)
    .then((data: any) => successResponse(req, res, data, 200))
    .catch(next);
};

const removeOne: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  Controller.delOne(id)
    .then((data: any) =>
      successResponse(req, res, { data, message: 'User erased' }, 200)
    )
    .catch(next);
};

router.get('/', list);
router.get('/:id', one);
router.post('/', newOne);
router.put('/:id', update);
router.delete('/:id', removeOne);

export default router;
