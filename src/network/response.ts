import { Response, Request } from 'express';
import { ErrorResponse } from '../middleware/errorResponse';

const successResponse = (
  req: Request,
  res: Response,
  dataResponse: any,
  status = 200
) => res.status(status).json({ ok: true, data: dataResponse });

const errorResponse = (err: ErrorResponse, res: Response) =>
  res.status(err.statusCode).json({ ok: false, error: err.message });

export { successResponse, errorResponse };
