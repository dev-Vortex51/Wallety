import z, { email } from 'zod';

export const RegisterSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: email({ message: 'Invalid email address' }),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: email({ message: 'Invalid email address' }),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

export type RegisterSchemaInput = z.infer<typeof RegisterSchema>['body'];
export type LoginSchemaInput = z.infer<typeof LoginSchema>['body'];
