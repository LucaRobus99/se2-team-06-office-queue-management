import { describe, it, expect, vi } from 'vitest';
import { createServiceService } from '../../../src/services/serviceService.js';

describe('White Box Test - serviceService', () => {
  it('should return the list of all services using serviceDao', async () => {
   
    const mockData = [
      { code: 'SHIP', name: 'shipping and packets', active: 1 },
      { code: 'EXTRA', name: 'new service', active: 0}
    ];

    const mockServiceDao = {
      findAll: vi.fn().mockResolvedValue(mockData)
    };

    const service = createServiceService(mockServiceDao);

    const result = await service.getAllServices();
  
    expect(result).toEqual(mockData);
    
    expect(mockServiceDao.findAll).toHaveBeenCalledTimes(1);
  });
});