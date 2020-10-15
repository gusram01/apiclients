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

  if (err.name === 'CastError') {
    error = new ErrorResponse(404, `Item not found`);
  }

  if (err.name === 'ValidationError') {
    const messages = Object
      //@ts-expect-error
      .values(err.errors)
      //@ts-expect-error
      .map((val) => val.message)
      .join(' ');
    error = new ErrorResponse(400, messages);
  }

  return errorResponse(err, res);
};

export { errorHandler };
