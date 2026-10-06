import { AppError } from '../errors/AppError.js';

/**
 * Turns every error into a JSON "problem details" response: { type, title, status, detail }.
 * Expected errors (AppError) keep their status; anything else is a 500 and is logged.
 */
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json(problem(err.status, err.title, err.message));
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json(problem(400, 'Bad Request', 'Request body is not valid JSON'));
  }
  console.error(err);
  return res.status(500).json(problem(500, 'Internal Server Error', 'Unexpected error'));
}

export function notFoundHandler(req, res) {
  res.status(404).json(problem(404, 'Not Found', `No route for ${req.method} ${req.path}`));
}

function problem(status, title, detail) {
  return { type: 'about:blank', title, status, detail };
}
