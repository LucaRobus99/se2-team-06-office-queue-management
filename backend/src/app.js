import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createHealthRouter } from './routes/healthRoutes.js';

import { createServiceDao } from './dao/serviceDao.js';
import { createServiceService } from './services/serviceService.js';
import { createServiceRouter } from './routes/serviceRoutes.js';

import { createTicketDao } from './dao/ticketDao.js';
import { createTicketService } from './services/ticketService.js';
import { createTicketRouter } from './routes/ticketRoutes.js';

/**
 * Builds the Express app and wires the layers together:
 * routes → services → DAOs → database.
 */

export function createApp({ db }) {
  const app = express();

  app.use(express.json());

  // Health check
  app.use('/api/health', createHealthRouter(db));

  // Services
  const serviceDao = createServiceDao(db);
  const serviceService = createServiceService(serviceDao);
  app.use('/api/services', createServiceRouter(serviceService));

  // Tickets
  const ticketDao = createTicketDao(db);
  const ticketService = createTicketService(serviceDao, ticketDao);
  app.use('/api/tickets', createTicketRouter(ticketService));

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}