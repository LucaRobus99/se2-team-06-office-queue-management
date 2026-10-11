import { describe, it, expect, vi } from 'vitest';
import { createTicketService } from '../../../src/services/ticketService.js';

describe('White Box Test - ticketService', () => {

  it('should throw ERR-101 if service code is invalid', async () => {
    const mockServiceDao = {};
    const mockTicketDao = {};
    const service = createTicketService(mockServiceDao, mockTicketDao);

    await expect(service.createTicket('INVALID!!CODE'))
      .rejects
      .toThrow('Invalid service code');
  });

  it('should throw ERR-100 if the service does not exist in DB', async () => {
    const mockServiceDao = {
      findByCode: vi.fn().mockResolvedValue(null) 
    };
    const mockTicketDao = {};
    const service = createTicketService(mockServiceDao, mockTicketDao);

    await expect(service.createTicket('SHIPS'))
      .rejects
      .toThrow('Service not found');

    expect(mockServiceDao.findByCode).toHaveBeenCalledWith('SHIPS');
  });

  it('should throw ERR-100 if the service is not active', async () => {
    const mockServiceDao = {
      findByCode: vi.fn().mockResolvedValue({code: 'EXTRA', name: 'new service', active: 0}) 
    };
    const mockTicketDao = {};
    const service = createTicketService(mockServiceDao, mockTicketDao);

    await expect(service.createTicket('EXTRA'))
      .rejects
      .toThrow('Service is not available');
  });

  
  it('should successfully create a ticket', async () => {

    const mockService = { id: 1, code: 'SHIP', name: 'shipping and packets', active: 1 };

    const mockServiceDao = {
      findByCode: vi.fn().mockResolvedValue(mockService)
    };

    const mockTicketDao = {
      insert: vi.fn().mockResolvedValue(1),
      countPeopleAhead: vi.fn().mockResolvedValue(3)
    };

    // Period opened today: it is reused
    const mockPeriodDao = {
      findOpen: vi.fn().mockResolvedValue({ id: 7, started_at: new Date().toISOString() }),
      open: vi.fn(),
      close: vi.fn(),
      nextSequenceNumber: vi.fn().mockResolvedValue(4)
    };

    const transaction = vi.fn((work) => work());

    const service = createTicketService(mockServiceDao, mockTicketDao, mockPeriodDao, transaction);


    const result = await service.createTicket(' ship ');


    expect(result).toEqual({
      ticketCode: 'SHIP-004',
      serviceName: 'shipping and packets',
      issuedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      peopleAhead: 3
    });

    // Verifichiamo che il DAO sia stato chiamato con il codice normalizzato 'SHIP'
    expect(mockServiceDao.findByCode).toHaveBeenCalledWith('SHIP');
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(mockPeriodDao.open).not.toHaveBeenCalled();
    expect(mockPeriodDao.close).not.toHaveBeenCalled();
    expect(mockPeriodDao.nextSequenceNumber).toHaveBeenCalledWith(7);
    expect(mockTicketDao.insert).toHaveBeenCalledWith(1, 7, 4, result.issuedAt);
    expect(mockTicketDao.countPeopleAhead).toHaveBeenCalledWith(7, 4);
  });

  it('should close a period opened on a previous day and number from a new one', async () => {
    const mockServiceDao = {
      findByCode: vi.fn().mockResolvedValue({ id: 1, code: 'SHIP', name: 'shipping and packets', active: 1 })
    };

    const mockTicketDao = {
      insert: vi.fn().mockResolvedValue(10),
      countPeopleAhead: vi.fn().mockResolvedValue(0)
    };

    const mockPeriodDao = {
      findOpen: vi.fn().mockResolvedValue({ id: 7, started_at: '2026-10-08T08:30:00.000Z' }),
      open: vi.fn().mockResolvedValue({ id: 8 }),
      close: vi.fn().mockResolvedValue(),
      nextSequenceNumber: vi.fn().mockResolvedValue(1)
    };

    const service = createTicketService(mockServiceDao, mockTicketDao, mockPeriodDao, (work) => work());

    const result = await service.createTicket('SHIP');

    expect(result.ticketCode).toBe('SHIP-001');
    expect(mockPeriodDao.close).toHaveBeenCalledWith(7, result.issuedAt);
    expect(mockPeriodDao.open).toHaveBeenCalledWith(1, result.issuedAt);
    expect(mockPeriodDao.nextSequenceNumber).toHaveBeenCalledWith(8);
  });

  it('should open the first period of a service that has none', async () => {
    const mockServiceDao = {
      findByCode: vi.fn().mockResolvedValue({ id: 2, code: 'PAY', name: 'payment service', active: 1 })
    };

    const mockTicketDao = {
      insert: vi.fn().mockResolvedValue(1),
      countPeopleAhead: vi.fn().mockResolvedValue(0)
    };

    const mockPeriodDao = {
      findOpen: vi.fn().mockResolvedValue(null),
      open: vi.fn().mockResolvedValue({ id: 1 }),
      close: vi.fn(),
      nextSequenceNumber: vi.fn().mockResolvedValue(1)
    };

    const service = createTicketService(mockServiceDao, mockTicketDao, mockPeriodDao, (work) => work());

    const result = await service.createTicket('PAY');

    expect(result.ticketCode).toBe('PAY-001');
    expect(mockPeriodDao.close).not.toHaveBeenCalled();
    expect(mockPeriodDao.open).toHaveBeenCalledWith(2, result.issuedAt);
  });

});