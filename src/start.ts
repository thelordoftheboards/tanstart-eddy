import { createCsrfMiddleware, createStart } from '@tanstack/react-start';
import { errorHandlingMiddleware } from '~/base/server/error-handling-middleware';

/**
 * Provides global middleware for Tanstack Start
 */
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

export const startInstance = createStart(() => ({
  // errorHandlingMiddleware runs first so it can also catch errors raised by the csrf middleware
  requestMiddleware: [errorHandlingMiddleware, csrfMiddleware],
}));
