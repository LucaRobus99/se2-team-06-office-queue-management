/**
 * Errors the service layer throws on purpose;
 * the error handler turns them into HTTP responses.
  */

export class AppError extends Error {
  constructor(status, title, detail) {
    super(detail);
    this.status = status;
    this.title = title;
  }
}

export class NotFoundError extends AppError {
  constructor(detail) {
    super(404, 'Not Found', detail);
  }
}

export class ValidationError extends AppError {
  constructor(detail) {
    super(400, 'Bad Request', detail);
  }
}

// Errors returned by the ticket API.
export class TicketError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'TicketError';
    this.code = code;
  }
}
