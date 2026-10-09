import { AppError, TicketError } from '../errors/AppError.js';

/**
 * Handles application errors and returns JSON responses.
 */

export function errorHandler(err, req, res, _next) {
  // Ticket validation and business errors
  if (err instanceof TicketError) {
    return res.status(500).json({
      code: err.code,
      message: err.message,
    });
  }

  // Invalid JSON sent to POST /api/tickets
  if (err.type === 'entity.parse.failed' && req.method === 'POST' && req.path === '/api/tickets') {
    return res.status(500).json({
      code: 'ERR-101',
      message: 'Invalid service code',
    });
  }

  // Existing error handling for other application errors
  if (err instanceof AppError) {
    return res.status(err.status).json(problem(err.status, err.title, err.message));
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json(problem(400, 'Bad Request', 'Request body is not valid JSON'));
  }

  // Unexpected errors
  console.error(err);

  return res.status(500).json({
    code: 'ERR-500',
    message: 'An error occurred, please try later',
  });
}


export function notFoundHandler(req, res) {
  res.status(404).json(problem(404, 'Not Found', `No route for ${req.method} ${req.path}`));
}


function problem(status, title, detail) {
  return { type: 'about:blank', title, status, detail };
}