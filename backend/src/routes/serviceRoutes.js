import { Router } from 'express';

/**
 * Routes for the services offered by the office.
 */

export function createServiceRouter(serviceService) {
  const router = Router();

  // GET /api/services
  router.get('/', async (_req, res) => {
    const services = await serviceService.getAllServices();
    res.json(services);
  });

  return router;
}