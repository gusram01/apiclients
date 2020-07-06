import { Error } from "mongoose";
import { Request, Response, NextFunction } from "express";

export class ErrorResponse extends Error {

  public statusCode: number;

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
    next: NextFunction) {

    let error = { ...err };
    error.message = err.message;

    console.log(err);

    if (err.name === 'CastError') {
      error = err404;
    }

    if (err.name === 'ValidationError') {
      const messages = Object
        //@ts-expect-error
        .values(err.errors)
        //@ts-expect-error
        .map(val => val.message);
      error = new ErrorResponse(400, messages.join(' '));

    }


    return res.status(error.statusCode)
      .json({ ok: false, error: error.message });

  }

}


const err500 = new ErrorResponse(500, `Server Error`);
const err404Id = new ErrorResponse(404, `Id not found`);
const err404 = new ErrorResponse(404, `Item not found`);
const err403 = new ErrorResponse(403, `Bad credentials`);
const err400 = new ErrorResponse(400, `Please verify your request`);


export {
  err500,
  err404,
  err404Id,
  err403,
  err400
}