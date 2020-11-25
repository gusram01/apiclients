import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';
import { appRoles } from './roles';
import { store } from '../store/store';

const authentication: RequestHandler = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new ErrorResponse(401, 'Access denied');
  }
  if (req.headers.authorization.includes('Bearer')) {
    // @ts-expect-error
    req.user = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.KEYSECRET_JWT!
    );
    // @ts-expect-error
    if (req.user.exp >= new Date().getTime() / 1000) {
      return next();
    }
  }
  throw new ErrorResponse(401, 'Access denied');
};

const authorization: RequestHandler = (req, res, next) => {
  store
    .roles()
    .then((data: { _id: number; description: string }[]) => {
      // From store get valid roles and compare with user request
      //@ts-expect-error
      const actualRole = data.find((item) => item._id === +req.user.roles);
      if (!actualRole) {
        throw new ErrorResponse(403, 'Unauthorized');
      }

      // From appRoles auxiliar object find the conditions available for actual request
      const constraints = appRoles.find(
        (item) => item.role === actualRole.description
      );
      if (!constraints) {
        throw new ErrorResponse(403, 'Unauthorized');
      }

      // Validate if the appRoles includes persmissions to url request
      const permissions = constraints.tables.find(
        (item) => item.table === req.url.split('/')[1]
      );
      if (!permissions) {
        throw new ErrorResponse(403, 'Unauthorized');
      }

      // Validate if the appRoles includes persmissions to method request
      if (!permissions.methods.includes(req.method)) {
        throw new ErrorResponse(403, 'Unauthorized');
      }

      //@ts-expect-error
      req.deliveredResults = permissions.constraints;
      next();
    })
    .catch(next);
};

export { authentication, authorization };
