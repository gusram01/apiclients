import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';
import { store } from '../store/store';
import { appTables } from '../store/tables';

const authentication: RequestHandler = (req, res, next) => {
  // Omit login & signup
  if (['/login', '/signup'].includes(req.url)) {
    return next();
  }
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
  // Omit login & signup
  if (['/login', '/signup'].includes(req.url)) {
    //@ts-expect-error
    req.tabledescription = {
      fields: ['_id', 'roles_id', 'nick', 'password', 'email', 'img_url'],
      access: 'all',
    };
    return next();
  }

  // From store get valid roles and compare with user request
  store
    .roles()
    .then((data: { _id: number; description: string }[]) => {
      // Get the description role for actual request
      //@ts-expect-error
      const actualRole = data.find((item) => item._id === +req.user.roles);
      if (!actualRole) {
        throw new ErrorResponse(403, 'Unauthorized');
      }

      // From appTables auxiliar object find the conditions available for actual request
      const tableDescription = appTables.find(
        (item) => item.table === req.url.split('/')[1]
      );
      if (!tableDescription) {
        throw new ErrorResponse(403, 'Unauthorized');
      }

      // From tableDescription obtain permisssions info
      const actualInfo = tableDescription.permissions.find(
        (item) => item.type === actualRole.description
      );
      if (!actualInfo) {
        throw new ErrorResponse(403, 'Unauthorized');
      }

      // Validate authorization method for actual request
      if (!actualInfo.methods.includes(req.method)) {
        throw new ErrorResponse(403, 'Unauthorized');
      }

      // const constraints = appRoles.find(
      //   (item) => item.role === actualRole.description
      // );

      // // Validate if the appRoles includes persmissions to url request
      // const permissions = constraints.tables.find(
      //   (item) => item.table === req.url.split('/')[1]
      // );
      // if (!permissions) {
      //   throw new ErrorResponse(403, 'Unauthorized');
      // }

      // // Validate if the appRoles includes persmissions to method request
      // if (!permissions.methods.includes(req.method)) {
      //   throw new ErrorResponse(403, 'Unauthorized');
      // }

      //@ts-expect-error
      req.tabledescription = {
        fields: tableDescription.fields,
        access: actualInfo.access,
      };
      return next();
    })
    .catch(next);
};

export { authentication, authorization };
