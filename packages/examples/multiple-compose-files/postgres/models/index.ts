import Sequelize from 'sequelize';

const postgresConfig = require('../config/postgresConfig'); // eslint-disable-line @typescript-eslint/no-var-requires

const config = postgresConfig.test;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const sequelize = new Sequelize(config);

const UserModel = sequelize.define(
  'User',
  {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
  },
  {},
);

export const db = {
  sequelize,
  Sequelize,
  UserModel,
};
