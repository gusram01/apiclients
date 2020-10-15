import { Error } from 'mongoose';
import { Response, Request, NextFunction, CookieOptions } from 'express';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
class ErrorResponse extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    // 'Error' breaks prototype chain here
    this.statusCode = statusCode;
    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const successResponse = (
  req: Request,
  res: Response,
  dataResponse: any,
  status = 200,
  cookie?: boolean
) => {
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + +process.env.EXPIN_COOKIEP!),
    httpOnly: true,
  };
  if (cookie) {
    return res
      .status(status)
      .cookie('token', dataResponse.token, cookieOptions)
      .json({ ok: true, data: dataResponse.id });
  }
  return res.status(status).json({ ok: true, data: dataResponse });
};

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

export { successResponse, errorHandler, ErrorResponse };
