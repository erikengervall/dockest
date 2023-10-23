const postgresConfig = {
  development: {
    database: 'baby',
    username: 'dont',
    password: 'hurtme',
    host: 'localhost',
    port: 5435,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    database: 'baby',
    username: 'dont',
    password: 'hurtme',
    host: 'localhost',
    port: 5435,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    database: 'baby',
    username: 'dont',
    password: 'hurtme',
    host: 'localhost',
    port: 5435,
    dialect: 'postgres',
    logging: false,
  },
};

module.exports = postgresConfig;
