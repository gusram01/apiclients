import { Request, Response, NextFunction } from 'express';

const okResponse = (statusCode: number, data: any) => {
  return (res: Response, req: Request, next: NextFunction) => {
    return res.status(statusCode).json({ ok: true, data: data });
  };
};

export default okResponse;
