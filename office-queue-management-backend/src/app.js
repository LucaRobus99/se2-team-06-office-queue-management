import express from 'express';
import { createDummyDao } from './dao/dummyDao.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createDummyRouter } from './routes/dummyRoutes.js';
import { createHealthRouter } from './routes/healthRoutes.js';
import { createDummyService } from './services/dummyService.js';

/**
 * Builds the Express app and wires the layers together: routes → services → DAOs → database.
 * `db` is anything with a `query(sql, params)` method (the SQLite database, or a fake in tests).
 */
export function createApp({ db }) {
  const dummyService = createDummyService(createDummyDao(db));

  const app = express();
  app.use(express.json());

  app.use('/api/health', createHealthRouter(db));
  app.use('/api/dummies', createDummyRouter(dummyService));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
