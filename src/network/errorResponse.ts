import { Response, Request, NextFunction } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';

const errorResponse = (err: ErrorResponse, res: Response) =>
  res.status(err.statusCode).json({ ok: false, error: err.message });

const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  if (err.message.split(' ').includes('duplicate')) {
    error = new ErrorResponse(
      400,
      `${err.message.replace(
        'duplicate key value violates unique constraint',
        'MUST BE UNIQUE: '
      )}`
    );
  }

  return errorResponse(error, res);
};

export { errorHandler };
