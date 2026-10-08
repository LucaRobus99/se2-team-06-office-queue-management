/**
 * Service layer: manages business logic for services.
 */

export function createServiceService(serviceDao) {
  return {
    async getAllServices() {
      return await serviceDao.findAll();
    },
  };
}