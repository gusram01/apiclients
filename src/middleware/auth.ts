import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const checkAuth = (req: Request) => {
  let token;
  if (!req.headers.authorization) {
    throw new ErrorResponse(401, 'Access denied');
  }
  if (req.headers.authorization.includes('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw new ErrorResponse(401, 'Access denied');
  }

  return jwt.verify(token, process.env.KEYSECRET_JWT!);
};

export { checkAuth };
