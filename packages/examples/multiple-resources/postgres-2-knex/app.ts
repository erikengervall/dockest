import { knex } from './models';

const { seedBanana } = require('./data.json'); // eslint-disable-line @typescript-eslint/no-var-requires

const getFirstEntry = async () => knex('bananas').where({ size: seedBanana.size }).first();

export const app = async () => {
  const firstEntry = await getFirstEntry();

  return {
    firstEntry,
  };
};
