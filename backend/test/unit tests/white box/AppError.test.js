import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, ValidationError, TicketError } from '../../../src/errors/AppError.js';

describe('White Box Test - Custom Error Classes', () => {

  it('should correctly create the base class of AppError', () => {
    const err = new AppError(418, "I'm a teapot", 'Teapot description');

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
    expect(err.status).toBe(418);
    expect(err.title).toBe("I'm a teapot");
    expect(err.message).toBe('Teapot description');
  });

  it('should instantiate NotFoundError with status 404 and title "Not Found"', () => {
    const err = new NotFoundError('Resource not found');

    expect(err).toBeInstanceOf(AppError);
    expect(err.status).toBe(404);
    expect(err.title).toBe('Not Found');
    expect(err.message).toBe('Resource not found');
  });

  it('should instantiate ValidationError with status 400 and title "Bad Request"', () => {
    const err = new ValidationError('Input data are not valid');

    expect(err).toBeInstanceOf(AppError);
    expect(err.status).toBe(400);
    expect(err.title).toBe('Bad Request');
    expect(err.message).toBe('Input data are not valid');
  });

  it('should instantiate TicketError with name, code and messagge', () => {
    const err = new TicketError('ERR-100', 'Service not found');

    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('TicketError');
    expect(err.code).toBe('ERR-100');
    expect(err.message).toBe('Service not found');
  });

});