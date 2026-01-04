import { NextFunction, Request, Response } from 'express';
import { catchAsync } from './../../utils/asyncHandler';
import { WalletService } from './wallet.service';
import { DepositSchemaInput, TransferSchemaInput } from './wallet.schema';

const walletService = new WalletService();

export const depositHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      ...req.body,
      userId: req?.user?.id,
    };

    // Extract validated data from request
    const data = await walletService.deposit(
      payload as DepositSchemaInput & { userId: string }
    );

    res.status(200).json({
      status: 'success',
      data,
    });
  }
);

export const transferHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      ...req.body,
      senderId: req?.user?.id,
    };

    // Extract validated data from request
    const data = await walletService.transfer(
      payload as TransferSchemaInput & { senderId: string }
    );

    res.status(200).json({
      status: 'success',
      data,
    });
  }
);

export const getHistoryHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page =
      parseInt(req.query.page as string) > 0
        ? parseInt(req.query.page as string)
        : 1;
    const limit =
      parseInt(req.query.limit as string) > 0
        ? parseInt(req.query.limit as string)
        : 10;
    const userId = req?.user?.id;

    const data = await walletService.getHistory(userId as string, page, limit);

    res.status(200).json({
      status: 'success',
      result: data.transactions.length,
      data,
    });
  }
);
