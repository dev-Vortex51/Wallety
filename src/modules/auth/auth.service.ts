import prisma from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { LoginSchemaInput, RegisterSchemaInput } from './auth.schema';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/generateToken';

export class AuthService {
  async register(input: RegisterSchemaInput) {
    //   check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    // throw error if user exists
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // create user and wallet
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });

      const newWallet = await tx.wallet.create({
        data: {
          balance: 0,
          userId: newUser.id,
        },
      });

      return { newUser, newWallet };
    });

    // generate token
    const token = generateToken(result.newUser.id);

    // remove password from user object
    const { password: _, ...userWithoutPassword } = result.newUser;

    return {
      user: userWithoutPassword,
      wallet: result.newWallet,
      token,
    };
  }

  async login(input: LoginSchemaInput) {
    // find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user.id);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
