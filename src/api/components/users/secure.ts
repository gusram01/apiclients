import { RequestHandler } from 'express';
import { checkAuth } from '../../../middleware/auth';
import { ErrorResponse } from '../../../utils/ErrorResponse';
import Controller from './index';

const secure: RequestHandler = (req, res, next) => {
  const decoded = checkAuth(req);
  //@ts-expect-error
  Controller.findId(decoded.id)
    .then((doc) => {
      if (!doc) {
        throw new ErrorResponse(401, 'Acces denied');
      }
      //@ts-expect-error
      req.user = doc;
      next();
    })
    .catch(next);
};

const validateRol: RequestHandler = (req, res, next) => {
  //@ts-expect-error
  if (req.user.category === 'ADMIN') {
    return next();
  } else {
    throw new ErrorResponse(403, 'Unauthorized');
  }
};

export { secure, validateRol };
