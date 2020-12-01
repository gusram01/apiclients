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

  if (err.message.includes('duplicate key value violates')) {
    error = new ErrorResponse(
      400,
      `${err.message.replace(
        'duplicate key value violates unique constraint',
        'MUST BE UNIQUE: '
      )}`
    );
  }
  if (err.message.includes('violates not-null constraint')) {
    error = new ErrorResponse(
      400,
      `${err.message.replace(
        'violates not-null constraint',
        'Please send complete info!! '
      )}`
    );
  }
  if (err.message.includes('invalid input syntax')) {
    error = new ErrorResponse(
      400,
      `${err.message.replace(
        'invalid input syntax for type uuid',
        'ID IS NOT CORRECT'
      )}`
    );
  }
  if (err.message.includes('No data returned from the query')) {
    error = new ErrorResponse(
      404,
      `${err.message.replace(
        'No data returned from the query',
        'Try with another parameter: << REMEMBER case sensitive >>'
      )}`
    );
  }
  if (err.message.includes('missing FROM-clause entry for table')) {
    error = new ErrorResponse(
      404,
      `${err.message.replace(
        'missing FROM-clause entry for table',
        `Please check table name: << REMEMBER case sensitive >>`
      )}`
    );
  }

  return errorResponse(error, res);
};

export { errorHandler };
