import { validationResult } from 'express-validator';
import { RequestHandler } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';

export const validationFields: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ErrorResponse(
      400,
      errors
        .array()
        .map((err) => err.msg)
        .join(' and ')
    );
  }
  return next();
};
