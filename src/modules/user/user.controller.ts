import { HttpStatus } from '../../constants/http-status.js';
import { ErrorCode } from '../../constants/error-codes.js';
import { AppError } from '../../utils/app-error.js';
import { catchAsync } from '../../utils/catch-async.js';
import type { CreateUserInput } from './user.validation.js';
import { userService } from './user.service.js';

export const listUsers = catchAsync(async (_req, res) => {
  const users = await userService.listUsers();

  res.status(HttpStatus.OK).json({
    status: 'success',
    data: {
      users,
    },
  });
});

export const getUser = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    throw new AppError(
      'User id is required.',
      HttpStatus.BAD_REQUEST,
      true,
      ErrorCode.VALIDATION_ERROR,
    );
  }

  const user = await userService.getUserById(id);

  res.status(HttpStatus.OK).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body as CreateUserInput);

  res.status(HttpStatus.CREATED).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const getCurrentUser = catchAsync((req, res) => {
  res.status(HttpStatus.OK).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});
