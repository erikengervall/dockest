import { Sequelize, STRING } from 'sequelize';

const postgresConfig = require('../config/postgresConfig.js'); // eslint-disable-line @typescript-eslint/no-var-requires

const config = postgresConfig.test;

const sequelize = new Sequelize(config);

const UserModel = sequelize.define(
  'User',
  {
    firstName: STRING,
    lastName: STRING,
    email: STRING,
  },
  {},
);

export const db = {
  sequelize,
  Sequelize,
  UserModel,
};
