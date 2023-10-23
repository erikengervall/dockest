const config = {
  database: 'what',
  username: 'is',
  password: 'love',
  host: 'localhost',
  port: 5433,
  dialect: 'postgres',
  logging: false,
};

const postgresConfig = {
  development: { ...config },
  test: { ...config },
  production: { ...config },
};

module.exports = postgresConfig;
