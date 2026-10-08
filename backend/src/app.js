import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createHealthRouter } from './routes/healthRoutes.js';

/**
 * Builds the Express app and wires the layers together:
 * routes → services → DAOs → database.
 */
export function createApp({ db }) {
  const app = express();

  app.use(express.json());

  // Health check
  app.use('/api/health', createHealthRouter(db));

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}