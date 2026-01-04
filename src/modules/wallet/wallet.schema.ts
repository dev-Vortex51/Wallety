import { email, z } from 'zod';

export const DepositSchema = z.object({
  body: z.object({
    amount: z
      .number({ message: 'Amount is required' })
      .positive({ message: 'Amount must be greater than zero' })
      .min(1, { message: 'Amount must be at least 1' }),
  }),
});

export const transferSchema = z.object({
  body: z.object({
    email: email({ message: 'Invalid email address' }),
    amount: z
      .number({ message: 'Amount is required' })
      .positive({ message: 'Amount must be greater than zero' })
      .min(1, { message: 'Minimum transfer amount is 1' }),
  }),
});

export type DepositSchemaInput = z.infer<typeof DepositSchema>['body'];
export type TransferSchemaInput = z.infer<typeof transferSchema>['body'];
