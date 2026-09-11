import { ErrorCode } from '../../constants/error-codes.js';
import { HttpStatus } from '../../constants/http-status.js';
import { AppError } from '../../utils/app-error.js';
import { userRepository } from './user.repository.js';
import type { CreateUserData, User } from './user.types.js';

export const userService = {
  listUsers: async (): Promise<User[]> => {
    return userRepository.findAll();
  },

  getUserById: async (id: string): Promise<User> => {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.', HttpStatus.NOT_FOUND, true, ErrorCode.NOT_FOUND);
    }

    return user;
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError(
        'A user with this email already exists.',
        HttpStatus.BAD_REQUEST,
        true,
        ErrorCode.VALIDATION_ERROR,
      );
    }

    return userRepository.create(data);
  },
};
