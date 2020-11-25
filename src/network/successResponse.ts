import { Response, Request } from 'express';

const successResponse = (
  req: Request,
  res: Response,
  dataResponse: any,
  status = 200
) => res.status(status).json({ ok: true, data: dataResponse });

export { successResponse };
