import z, { email } from 'zod';

export const RequestSchema = z.object({
  body: z.object({
    amount: z.number().min(0.01, { message: 'Amount must be at least 0.01' }),
    description: z
      .string()
      .max(255, { message: 'Description must be at most 255 characters' }),
    email: email({ message: 'Invalid email address' }),
  }),
});

export type RequestSchemaInput = z.infer<typeof RequestSchema>['body'];
