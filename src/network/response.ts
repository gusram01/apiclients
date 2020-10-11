import { Response, Request } from 'express';

const successResponse = (
  req: Request,
  res: Response,
  dataResponse: any,
  status = 200
) => res.status(status).json({ ok: true, data: dataResponse });

const errorResponse = (
  req: Request,
  res: Response,
  message = 'Internal Server Error',
  status = 500
) => res.status(status).json({ ok: false, error: message });

export { successResponse, errorResponse };
