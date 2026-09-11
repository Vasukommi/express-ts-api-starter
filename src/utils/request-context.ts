import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestContext = {
  correlationId: string;
  method: string;
  path: string;
  startedAt: number;
};

const requestContext = new AsyncLocalStorage<RequestContext>();

export const runWithRequestContext = <T>(context: RequestContext, callback: () => T): T => {
  return requestContext.run(context, callback);
};

export const getRequestContext = (): RequestContext | undefined => {
  return requestContext.getStore();
};

export const getCorrelationId = (): string | undefined => {
  return getRequestContext()?.correlationId;
};
