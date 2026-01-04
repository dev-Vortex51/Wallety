import prisma from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { DepositSchemaInput, TransferSchemaInput } from './wallet.schema';

export class WalletService {
  async deposit(input: DepositSchemaInput & { userId: string }) {
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: input.userId,
      },
    });

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    return await prisma.$transaction(async (tsx) => {
      const updatedWallet = await tsx.wallet.update({
        where: { userId: input.userId },
        data: { balance: { increment: input.amount } },
      });

      await tsx.transaction.create({
        data: {
          amount: input.amount,
          type: 'DEPOSIT',
          receiverId: wallet.id,
          senderId: null,
        },
      });

      return updatedWallet;
    });
  }

  async transfer(input: TransferSchemaInput & { senderId: string }) {
    const result = await prisma.$transaction(async (tsx) => {
      //  1. Find sender's wallet
      const senderWallet = await tsx.wallet.findUnique({
        where: { userId: input.senderId },
      });

      if (!senderWallet) {
        throw new AppError('Sender wallet not found', 404);
      }

      //  2. Check for Sufficient Balance
      if (Number(senderWallet.balance) < input.amount) {
        throw new AppError('Insufficient balance', 400);
      }

      // 3. Find recipient's wallet by email
      const recipient = await tsx.user.findUnique({
        where: { email: input.email },
        select: { wallet: true },
      });

      // 4. Handle Recipient Not Found

      if (!recipient || !recipient.wallet) {
        throw new AppError('Recipient not found', 404);
      }

      //   5. Check for same wallet transfer
      if (recipient.wallet.userId === input.senderId) {
        throw new AppError('Cannot transfer to the same wallet', 400);
      }

      // 6. Perform the transfer

      const updatedSenderWallet = await tsx.wallet.update({
        where: { userId: input.senderId },
        data: { balance: { decrement: input.amount } },
      });

      await tsx.wallet.update({
        where: { userId: recipient.wallet.userId },
        data: { balance: { increment: input.amount } },
      });

      await tsx.transaction.create({
        data: {
          amount: input.amount,
          type: 'TRANSFER',
          senderId: senderWallet.id,
          receiverId: recipient.wallet.id,
        },
      });

      return updatedSenderWallet;
    });

    return result;
  }

  async getHistory(userId: string, page: number = 1, limit: number = 10) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    const skip = (page - 1) * limit;

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            senderId: wallet.id,
          },
          {
            receiverId: wallet.id,
          },
        ],
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      skip: skip,
      include: {
        sender: {
          select: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        receiver: {
          select: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    const total = await prisma.transaction.count({
      where: {
        OR: [{ senderId: wallet.id }, { receiverId: wallet.id }],
      },
    });

    return {
      transactions,
      meta: { total, page, totalPages: Math.ceil(total / limit) },
    };
  }
}
