declare global {
  namespace Express {
    interface UserContext {
      email?: string;
      id: string;
      roles: string[];
    }

    interface Request {
      user?: UserContext;
    }
  }
}

export {};
