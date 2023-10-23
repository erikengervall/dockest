import { db } from './models';

const { seedUser } = require('./data.json'); // eslint-disable-line @typescript-eslint/no-var-requires

const getFirstEntry = async () => {
  // FUTURE TODO: Handle type error
  return await (db as any).UserModel.findOne({
    where: {
      email: seedUser.email,
    },
    returning: true,
  });
};

export const app = async () => {
  const firstEntry = await getFirstEntry();

  return {
    firstEntry,
  };
};
