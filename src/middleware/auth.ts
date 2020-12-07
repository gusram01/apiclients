import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';

import { MyContext } from '../server/app';

const authentication: RequestHandler = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.includes('Bearer')
  ) {
    throw new ErrorResponse(401, 'Access denied');
  }

  try {
    req.user = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.KEYSECRET_JWT as string
    ) as MyContext;
    if (req.user.exp >= new Date().getTime() / 1000) {
      return next();
    }
  } catch (e) {
    throw new ErrorResponse(401, 'Access denied');
  }
};

const authorization: RequestHandler = (req, res, next) => {
  // From store get valid roles and compare with user request
  // Controller.roles(req)
  //   .then((data: { _id: number; description: string }[]) => {
  //     // Get the description role for actual request
  //     const actualRole = data.find((item) => item._id === +req.user.roles);
  //     if (!actualRole) {
  //       throw new ErrorResponse(403, 'Unauthorized');
  //     }

  //     // From appTables auxiliar object find the conditions available for actual request
  //     const tableDescription = appTables.find(
  //       (item) => item.table === req.url.split('/')[1]
  //     );
  //     if (!tableDescription) {
  //       throw new ErrorResponse(403, 'Unauthorized');
  //     }

  //     // From tableDescription obtain permisssions info
  //     const actualInfo = tableDescription.permissions.find(
  //       (item) => item.type === actualRole.description
  //     );
  //     if (!actualInfo) {
  //       throw new ErrorResponse(403, 'Unauthorized');
  //     }

  //     // Validate authorization method for actual request
  //     if (!actualInfo.methods.includes(req.method)) {
  //       throw new ErrorResponse(403, 'Unauthorized');
  //     }

  //     //@ts-expect-error
  //     req.tabledescription = {
  //       access: actualInfo.access,
  //     };
  // })
  return next();
  // .catch(next);
};

export { authentication, authorization };
