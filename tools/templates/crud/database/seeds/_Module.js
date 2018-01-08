import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['$module$']);

  await knex('$module$')
    .returning('id')
    .insert({ name: 'test' });
}