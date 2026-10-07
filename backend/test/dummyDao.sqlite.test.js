import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDummyDao } from '../src/dao/dummyDao.js';
import { createSqliteDb } from '../src/db/sqlite.js';

/** Runs the REAL DAO SQL against an in-memory SQLite database (seeded from db/*.sql). */
describe('dummyDao on SQLite', () => {
  let db;
  let dao;
  beforeEach(() => {
    db = createSqliteDb(':memory:');
    dao = createDummyDao(db);
  });
  afterEach(() => db.close());

  it('reads the seed data', async () => {
    const all = await dao.findAll();
    expect(all).toHaveLength(6);
    expect(all[0]).toMatchObject({ id: 1, name: 'Counter 1' });
    expect(typeof all[0].createdAt).toBe('string');
  });

  it('filters by name, case-insensitively', async () => {
    expect((await dao.findByName('COUNTER')).map((d) => d.name)).toEqual(['Counter 1', 'Counter 2', 'Counter 3']);
  });

  it('inserts, finds and deletes', async () => {
    const created = await dao.insert({ name: 'New', description: null });
    expect(created).toMatchObject({ id: 7, name: 'New', description: null });
    expect(await dao.findById(7)).toMatchObject({ name: 'New' });
    expect(await dao.deleteById(7)).toBe(true);
    expect(await dao.deleteById(7)).toBe(false);
    expect(await dao.findById(7)).toBeNull();
  });
});
