import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from '../classes/errors/errorResponse';

export default function errorHandler(
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction) {

  let error = { ...err }
  error.message = err.message;

  console.log(err);

  if (err.name === 'CastError') {
    //@ts-expect-error
    let message = `The id ${error.value} was not found`;
    error = new ErrorResponse(404, message);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    //@ts-expect-error
    const messages = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(400, messages.join(' '));
  }

  return res.status(error.statusCode)
    .json({ ok: false, error: error.message });
}

