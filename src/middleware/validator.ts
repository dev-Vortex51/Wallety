import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      next(new AppError('All fields are required', 400));
    }
  };
