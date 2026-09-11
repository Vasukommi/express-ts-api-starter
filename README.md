# Express TypeScript Enterprise Template

A production-minded Express 5 API starter built for teams that want a clean foundation instead of another pile of controllers. It uses strict TypeScript, feature-based modules, fail-fast environment validation, request correlation, structured logs, centralized errors, rate limiting, security headers, health checks, tests, Docker, and GitHub Actions.

## Why This Shape

This template follows the current official guidance I checked before building:

- Express recommends keeping production dependencies current, validating user input, using Helmet, protecting authorization endpoints from brute force, doing logging correctly, handling exceptions properly, setting `NODE_ENV=production`, and adding health checks plus graceful shutdown.
- Express 5 automatically forwards rejected async route promises to error middleware, but this template still includes `catchAsync` as a small typed convention for controllers.
- Node's stable `AsyncLocalStorage` is used for request-scoped context, so every log in a request can include the same correlation ID.
- `express-rate-limit` is configured with modern `RateLimit` draft headers and legacy headers disabled.
- Zod `safeParse` powers environment and request validation without scattered `try/catch` blocks.
- Vitest is used for backend tests and coverage.

## Project Layout

```txt
src/
  config/        Type-safe runtime configuration and middleware options
  constants/     Shared HTTP status and error code constants
  database/      Database adapter boundary and health hooks
  middlewares/   Global plumbing: auth, CORS errors, logging, rate limit, validation
  modules/       Feature folders with route/controller/service/repository files
  types/         Express request augmentation
  utils/         AppError, async wrapper, logger, request context, shutdown
  app.ts         Express app composition
  routes.ts      API v1 route registry
  server.ts      Startup, listener, and lifecycle handling
tests/           Integration coverage with Supertest and Vitest
```

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

The API starts on `http://localhost:3000`.

Useful endpoints:

- `GET /health`
- `GET /health/ready`
- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/users/me` with a valid HS256 bearer token

## Scripts

```bash
npm run dev          # local watch mode
npm run build        # compile to dist/
npm start            # run compiled app
npm run lint         # ESLint 9 flat config
npm run typecheck    # strict TypeScript check
npm test             # Vitest integration tests
npm run coverage     # coverage report
```

## Production Notes

- `DATABASE_URL` and `JWT_SECRET` are mandatory in production.
- Wildcard CORS (`*`) is rejected in production.
- `X-Correlation-ID` is accepted from clients when safe, otherwise generated.
- Rate limiting uses `standardHeaders: 'draft-8'` and `legacyHeaders: false`.
- `SIGTERM` and `SIGINT` stop accepting new requests, wait for the HTTP server to close, run cleanup tasks, then exit.
- `src/database/client.ts` is a placeholder adapter. Replace it with Prisma, Drizzle, pg, Mongoose, or your real persistence client while keeping the same `connectDatabase`, `closeDatabase`, and health-check boundary.

## API Response Style

Success:

```json
{
  "status": "success",
  "data": {}
}
```

Operational errors:

```json
{
  "status": "fail",
  "code": "VALIDATION_ERROR",
  "correlationId": "request-id",
  "message": "Request validation failed."
}
```

Unknown or programmer errors are logged deeply and hidden from clients in production.

## Research Sources

- Express production security: https://expressjs.com/en/advanced/best-practice-security/
- Express production performance: https://expressjs.com/en/advanced/best-practice-performance/
- Express error handling: https://expressjs.com/en/guide/error-handling/
- Express health checks and graceful shutdown: https://expressjs.com/en/advanced/healthcheck-graceful-shutdown/
- Node AsyncLocalStorage: https://nodejs.org/api/async_context.html
- express-rate-limit configuration: https://express-rate-limit.mintlify.app/reference/configuration
- Helmet: https://helmet.js.org/
- Zod basics: https://zod.dev/basics
- Vitest guide: https://vitest.dev/guide/
