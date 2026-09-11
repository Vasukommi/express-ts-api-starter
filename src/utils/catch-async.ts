import type { NextFunction, Request, RequestHandler, Response } from 'express';

type MaybePromise<T> = T | Promise<T>;
type Controller = (req: Request, res: Response, next: NextFunction) => MaybePromise<void>;

export const catchAsync = (controller: Controller): RequestHandler => {
  return (req, res, next) => {
    void Promise.resolve(controller(req, res, next)).catch(next);
  };
};
