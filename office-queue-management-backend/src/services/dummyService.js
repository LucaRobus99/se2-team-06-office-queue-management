import { NotFoundError, ValidationError } from '../errors/AppError.js';

export const NAME_MAX = 100;
export const DESCRIPTION_MAX = 500;

/**
 * Service layer: business rules and validation. Knows nothing about HTTP or SQL;
 * it receives the DAO it uses, so tests can pass a fake one.
 */
export function createDummyService(dummyDao) {
  return {
    list(nameFilter) {
      const filter = nameFilter?.trim();
      return filter ? dummyDao.findByName(filter) : dummyDao.findAll();
    },

    async get(id) {
      const dummy = await dummyDao.findById(parseId(id));
      if (!dummy) throw new NotFoundError(`Dummy ${id} not found`);
      return dummy;
    },

    create(input) {
      const name = typeof input?.name === 'string' ? input.name.trim() : '';
      const description =
        typeof input?.description === 'string' && input.description.trim() !== ''
          ? input.description.trim()
          : null;

      if (!name) throw new ValidationError('name is required');
      if (name.length > NAME_MAX) throw new ValidationError(`name must be at most ${NAME_MAX} characters`);
      if (description && description.length > DESCRIPTION_MAX) {
        throw new ValidationError(`description must be at most ${DESCRIPTION_MAX} characters`);
      }
      return dummyDao.insert({ name, description });
    },

    async remove(id) {
      const deleted = await dummyDao.deleteById(parseId(id));
      if (!deleted) throw new NotFoundError(`Dummy ${id} not found`);
    },
  };
}

function parseId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new ValidationError(`Invalid id: ${id}`);
  return n;
}
