import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/asyncHandler';
import { AuthService } from './auth.service';
import { LoginSchemaInput, RegisterSchemaInput } from './auth.schema';

const authService = new AuthService();

export const registerHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.register(req.body as RegisterSchemaInput);
    res.status(201).json({
      status: 'success',
      data: result,
    });
  }
);

export const loginHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.login(req.body as LoginSchemaInput);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  }
);
