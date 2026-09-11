import { v4 as uuidv4 } from 'uuid';

import type { CreateUserData, User } from './user.types.js';

const now = new Date().toISOString();

const users = new Map<string, User>([
  [
    '9ab967c7-f7f2-4ec5-929c-0d7d3a8d9b6c',
    {
      id: '9ab967c7-f7f2-4ec5-929c-0d7d3a8d9b6c',
      email: 'ada@example.com',
      name: 'Ada Lovelace',
      createdAt: now,
      updatedAt: now,
    },
  ],
]);

export const userRepository = {
  findAll: (): Promise<User[]> => {
    return Promise.resolve(Array.from(users.values()));
  },

  findByEmail: (email: string): Promise<User | undefined> => {
    return Promise.resolve(Array.from(users.values()).find((user) => user.email === email));
  },

  findById: (id: string): Promise<User | undefined> => {
    return Promise.resolve(users.get(id));
  },

  create: (data: CreateUserData): Promise<User> => {
    const timestamp = new Date().toISOString();
    const user: User = {
      id: uuidv4(),
      email: data.email,
      name: data.name,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    users.set(user.id, user);
    return Promise.resolve(user);
  },
};
