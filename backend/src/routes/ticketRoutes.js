import { Router } from 'express';

/**
 * Routes for ticket creation.
 */

export function createTicketRouter(ticketService) {
  const router = Router();

  // POST /api/tickets
  router.post('/', async (req, res) => {
    const { serviceCode } = req.body ?? {};

    const ticket = await ticketService.createTicket(serviceCode);

    res.status(201).json(ticket);
  });

  return router;
}