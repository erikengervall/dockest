const dbConfig = {
  client: 'postgresql',
  connection: {
    database: 'dont',
    user: 'hurtme',
    password: 'nomore',
    host: 'localhost',
    port: 5436,
  },
  migrations: {
    directory: './postgres-2-knex/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './postgres-2-knex/seeders',
  },
};

module.exports = dbConfig;
