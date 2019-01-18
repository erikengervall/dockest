# Dockest

`Dockest` is a small library that executes jest unit tests together with your application's dependencies.

## Requirements

`Dockest` requires at least Jest **v20.0.0** in order to ensure Jest's [CLI interface](https://github.com/facebook/jest/blob/master/packages/jest-cli/src/cli/index.js#L62).

## Usage

`Dockest` requires configuration in order to run. The following is a minimal example of how to run `Dockest` with postgres.

```javascript
const {
  default: Dockest,
  runners: { PostgresRunner },
} = require('dockest')

const integration = new Dockest({
  dockest: {
    dockerComposeFilePath: './docker-compose-integration.yml',
  },
  jest: {
    lib: require('jest'),
  },
  runners: {
    pg1: new PostgresRunner({
      label: env.label,
      username: env.username,
      password: env.password,
      database: env.database,
      host: env.host,
      port: env.port,
      service: env.service,
      commands: [
        'sequelize db:migrate:undo:all',
        'sequelize db:migrate',
        'sequelize db:seed:undo:all',
        'sequelize db:seed --seed 20190101001337-demo-user',
      ],
    }),
  },
})

integration.run()
```
