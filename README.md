# Dockest

`Dockest` is a small library that executes Jest alongside with your application's dependencies.

## Requirements

`Dockest` requires at least Jest **v20.0.0** in order to ensure Jest's [CLI interface](https://github.com/facebook/jest/blob/master/packages/jest-cli/src/cli/index.js#L62).

## Usage

```javascript
const {
  default: Dockest,
  runners: { PostgresRunner },
} = require('dockest')

const integration = new Dockest({
  jest: {
    lib: require('jest'),
  },
  runners: {
    pg1: new PostgresRunner({
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
