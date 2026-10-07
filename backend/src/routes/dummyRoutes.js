import { Router } from 'express';

/**
 * Web layer: maps HTTP requests to service calls and sets status codes. No business logic here.
 * Express 5 forwards errors thrown in async handlers to the error handler automatically.
 */
export function createDummyRouter(dummyService) {
  const router = Router();

  // GET /api/dummies?name=abc
  router.get('/', async (req, res) => {
    res.json(await dummyService.list(req.query.name));
  });

  // GET /api/dummies/5
  router.get('/:id', async (req, res) => {
    res.json(await dummyService.get(req.params.id));
  });

  // POST /api/dummies  body: { "name": "...", "description": "..." }
  router.post('/', async (req, res) => {
    const created = await dummyService.create(req.body);
    res.status(201).location(`/api/dummies/${created.id}`).json(created);
  });

  // DELETE /api/dummies/5
  router.delete('/:id', async (req, res) => {
    await dummyService.remove(req.params.id);
    res.status(204).end();
  });

  return router;
}
