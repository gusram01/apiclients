import { err403, err400, ErrorResponse } from '../middleware/errorResponse';
import { Request, NextFunction } from 'express';

const match = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const signupLogin = (req: Request, next: NextFunction) => {
  const { email = '', password = '', passverify = '' } = req.body;
  if (passverify !== '' && passverify !== password) {
    return next(err400);
  }
  if (password !== '' && (password.length < 6 || password.length > 47)) {
    return next(err400);
  }
  if (email !== '' && !match.test(email)) {
    return next(err400);
  }
  return next();
};

export default signupLogin;
