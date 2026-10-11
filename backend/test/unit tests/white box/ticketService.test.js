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

    const mockService = { code: 'SHIP', name: 'shipping and packets', active: 1 };
    
    const mockServiceDao = {
      findByCode: vi.fn().mockResolvedValue(mockService)
    };

    const mockTicketDao = {
      insert: vi.fn().mockResolvedValue(1), 
      countPeopleAhead: vi.fn().mockResolvedValue(3) 
    };

    const service = createTicketService(mockServiceDao, mockTicketDao);

    
    const result = await service.createTicket(' ship '); 

    
    expect(result).toEqual({
      ticketCode: 'T-000001', 
      serviceName: 'shipping and packets',
      issuedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      peopleAhead: 3
    });

    // Verifichiamo che il DAO sia stato chiamato con il codice normalizzato 'CASSA'
    expect(mockServiceDao.findByCode).toHaveBeenCalledWith('SHIP');
    expect(mockTicketDao.insert).toHaveBeenCalledTimes(1);
    expect(mockTicketDao.countPeopleAhead).toHaveBeenCalledTimes(1);
  });

});