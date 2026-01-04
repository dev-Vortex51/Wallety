import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/asyncHandler';
import { RequestService } from './request.service';
import { RequestSchemaInput } from './request.schema';

const requestService = new RequestService();

export const requestPaymentHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await requestService.createRequest(
      req?.user?.id as string,
      req.body as RequestSchemaInput
    );

    res.status(201).json({ status: 'success', data: result });
  }
);

export const getIncomingRequestsHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await requestService.getIncomingRequests(
      req?.user?.id as string
    );

    res.status(200).json({ status: 'success', data: result });
  }
);

export const acceptRequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id;
    const userId = req?.user?.id;

    const result = await requestService.acceptRequest(
      userId as string,
      requestId
    );

    res.status(201).json({
      status: 'success',
      data: result,
    });
  }
);

export const rejectRequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id;
    const userId = req?.user?.id;

    const result = await requestService.rejectRequest(
      userId as string,
      requestId
    );

    res.status(201).json({
      status: 'success',
      data: result,
    });
  }
);
