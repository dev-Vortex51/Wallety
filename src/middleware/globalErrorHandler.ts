import { AppError } from '../utils/AppError';
import { NextFunction, Request, Response } from 'express';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Initialze error object

  let statusCode = 500;
  let message = 'Something went wrong';

  //  check if error is instanceof AppError

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if ((err as Error & { code?: string }).code === 'P2002') {
    statusCode = 400;
    message = 'Duplicate field value: please use another value';
  }
  // Send response
  return res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
     ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
