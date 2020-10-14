import { Error } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../network/response';

export class ErrorResponse extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    // 'Error' breaks prototype chain here
    this.statusCode = statusCode;
    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static errHandler(
    err: ErrorResponse,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let error = { ...err };
    error.message = err.message;

    console.log(err);

    if (err.name === 'CastError') {
      error = new ErrorResponse(404, `Item not found`);
    }

    if (err.name === 'ValidationError') {
      const messages = Object
        //@ts-expect-error
        .values(err.errors)
        //@ts-expect-error
        .map((val) => val.message);
      error = new ErrorResponse(400, messages.join(' '));
    }

    return errorResponse(err, res);
  }
}
