import { db } from './models';

const seedUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'demo@demo.com',
};

export const app = async () => {
  const firstEntry = await db.UserModel.findOne({
    where: {
      email: seedUser.email,
    },
    returning: true,
  });

  return {
    firstEntry,
  };
};
