import prisma from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { RequestSchemaInput } from './request.schema';

export class RequestService {
  async createRequest(userId: string, input: RequestSchemaInput) {
    // 1. Find requester wallet by userId
    const requester = await prisma.wallet.findUnique({
      where: { userId },
    });

    // 2. Throw error if requester wallet not found
    if (!requester) {
      throw new AppError('No wallet not found for this user', 404);
    }

    // 3. Find Payers wallet by email and grab wallet immediately
    const payer = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        wallet: true,
      },
    });

    // 4. Check if payer exists
    if (!payer || !payer.wallet) {
      throw new AppError('No wallet found for the provided email', 404);
    }

    //   5. Create payment request and return
    return prisma.request.create({
      data: {
        status: 'PENDING',
        amount: input.amount,
        description: input.description,
        requesterId: requester.id,
        payerId: payer.wallet.id,
      },
    });
  }

  async getIncomingRequests(userId: string) {
    // 1. Find wallet by userId
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    // 2. Throw error if wallet not found
    if (!wallet) {
      throw new AppError('No wallet found for this user', 404);
    }

    // 3. Find all pending incoming requests for the wallet
    return prisma.request.findMany({
      where: { payerId: wallet.id, status: 'PENDING' },
      orderBy: { timestamp: 'desc' },
      include: {
        requester: {
          select: {
            user: {
              select: { email: true, name: true },
            },
          },
        },
      },
    });
  }

  async acceptRequest(userId: string, requestId: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Find the Payer's Wallet (The person logged in)
      const payerWallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!payerWallet) throw new AppError('Wallet not found', 404);

      // 2. Find the Request
      // We don't need deep includes here, just the IDs are enough
      const request = await tx.request.findUnique({
        where: { id: requestId },
      });

      if (!request) throw new AppError('Request not found', 404);

      //  SECURITY CHECK 1: verify ownership
      if (request.payerId !== payerWallet.id) {
        throw new AppError('You are not authorized to pay this request', 403);
      }

      //  SECURITY CHECK 2: verify status
      if (request.status !== 'PENDING') {
        throw new AppError('This request has already been processed', 400);
      }

      // 3. Check Balance
      if (Number(payerWallet.balance) < Number(request.amount)) {
        throw new AppError('Insufficient balance', 400);
      }

      // 4. Perform the Transfer
      // Decrement Payer
      await tx.wallet.update({
        where: { id: payerWallet.id },
        data: { balance: { decrement: request.amount } },
      });

      // Increment Requester (Directly using requesterId from the request!)
      await tx.wallet.update({
        where: { id: request.requesterId },
        data: { balance: { increment: request.amount } },
      });

      // 5. Create the Transaction Record
      await tx.transaction.create({
        data: {
          amount: request.amount,
          type: 'TRANSFER',
          senderId: payerWallet.id,
          receiverId: request.requesterId,
        },
      });

      // 6. Close the Request
      const updatedRequest = await tx.request.update({
        where: { id: requestId },
        data: { status: 'PAID' },
      });

      return { message: 'Payment successful', request: updatedRequest };
    });
  }
  async rejectRequest(userId: string, requestId: string) {
    const payerWallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!payerWallet) {
      throw new AppError('No wallet found for this user', 404);
    }

    return await prisma.request.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  }
}
