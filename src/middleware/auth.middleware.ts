import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/asyncHandler';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get token from headers
    const authHeader = req.headers.authorization;

    // 2. Check if token exists and is valid
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Invalid token format! Please log in again.', 401);
    }

    // 3. Verify token

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    // 4. Attach user info to request object
    req.user = decoded;

    next();
  }
);
