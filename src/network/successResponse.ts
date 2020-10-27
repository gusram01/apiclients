import { Response, Request, CookieOptions } from 'express';

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

export { successResponse };
