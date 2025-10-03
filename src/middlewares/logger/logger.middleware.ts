import { NextFunction, Request, Response } from 'express';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
}
