import { beforeEach, describe, expect, it } from 'vitest';
import { NotFoundError, ValidationError } from '../src/errors/AppError.js';
import { createDummyService } from '../src/services/dummyService.js';

/** Fake DAO kept in memory, so the service is tested without a database. */
function fakeDao(seed = []) {
  let rows = seed.map((r, i) => ({ id: i + 1, description: null, createdAt: new Date(), ...r }));
  let nextId = rows.length + 1;
  return {
    findAll: async () => rows,
    findByName: async (n) => rows.filter((r) => r.name.toLowerCase().includes(n.toLowerCase())),
    findById: async (id) => rows.find((r) => r.id === id) ?? null,
    insert: async (d) => {
      const row = { id: nextId++, createdAt: new Date(), ...d };
      rows.push(row);
      return row;
    },
    deleteById: async (id) => {
      const before = rows.length;
      rows = rows.filter((r) => r.id !== id);
      return rows.length < before;
    },
  };
}

describe('dummyService', () => {
  let service;
  beforeEach(() => {
    service = createDummyService(fakeDao([{ name: 'Counter 1' }, { name: 'Kiosk' }]));
  });

  it('lists all, or filters by trimmed name', async () => {
    expect(await service.list()).toHaveLength(2);
    expect((await service.list('  kio ')).map((d) => d.name)).toEqual(['Kiosk']);
  });

  it('creates with trimmed values and empty description as null', async () => {
    const created = await service.create({ name: '  New ', description: '   ' });
    expect(created).toMatchObject({ id: 3, name: 'New', description: null });
  });

  it('rejects a missing or too long name', () => {
    expect(() => service.create({})).toThrow(ValidationError);
    expect(() => service.create({ name: 'x'.repeat(101) })).toThrow(ValidationError);
  });

  it('throws NotFound for unknown ids and ValidationError for bad ids', async () => {
    await expect(service.get('99')).rejects.toBeInstanceOf(NotFoundError);
    await expect(service.get('abc')).rejects.toBeInstanceOf(ValidationError);
    await expect(service.remove('99')).rejects.toBeInstanceOf(NotFoundError);
  });
});
