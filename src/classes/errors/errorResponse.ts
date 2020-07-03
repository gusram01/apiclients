import { Error } from "mongoose";

export class ErrorResponse extends Error {

  public statusCode: number;

  constructor(statusCode: number, message?: string) {
    super(message!);
    // 'Error' breaks prototype chain here
    this.statusCode = statusCode;
    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
