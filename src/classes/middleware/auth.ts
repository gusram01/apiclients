// import { NextFunction, Request, Response } from 'express';
// import { ErrorResponse } from '../errors/errorResponse';
// import jwt from 'jsonwebtoken';
// import User from '../../models/modelo-usuario';


// class AccessControl {

//   public async protect(req: Request, res: Response, next: NextFunction) {
//     let token;
//     if (!req.headers.authorization) return next(new ErrorResponse(401, "Access don't allowed"))
//     if (req.headers.authorization.includes('Bearer')) token = req.headers.authorization.split(' ')[1]
//     if (!token) return next(new ErrorResponse(401, "Access don't allowed"))

//     try {
//       const decoded = jwt.verify(token, process.env.KEYSECRET_JSONWEBT);
//       //@ts-expect-error
//       req.user = await User.findById(decoded.id);
//       next()
//     } catch (error) {
//       next(error)
//     }

//   };

//   // public validateRole(req: Request, res: Response, next: NextFunction) {
//   //   //@ts-expect-error
//   //   const { role } = req.user;
//   //   (role === 'ADMIN') ?
//   //     next() :
//   //     next(new ErrorResponse(401, "Access don't allowed"));
//   // };

// }

// const accessMiddle = new AccessControl();

// export {
//   accessMiddle
// } 