# Dockest

`Dockest` is a small library that executes Jest alongside with your application's dependencies.

## Requirements

`Dockest` requires at least Jest **v20.0.0** in order to ensure Jest's [CLI interface](https://github.com/facebook/jest/blob/master/packages/jest-cli/src/cli/index.js#L62).

## Usage

```javascript
const {
  default: Dockest,
  runners: { KafkaRunner, PostgresRunner },
} = require('dockest')

const integration = new Dockest({
  jest: {
    lib: require('jest'),
  },
  runners: {
    postgres: new PostgresRunner({
      username: 'username',
      password: 'password',
      database: 'database',
      host: 'localhost',
      port: 5432,
      service: 'postgres',
      commands: [
        'sequelize db:migrate:undo:all',
        'sequelize db:migrate',
        'sequelize db:seed:undo:all',
        'sequelize db:seed --seed 20190101001337-demo-user',
      ],
    }),
    kafka: new KafkaRunner({
      service: 'kafka',
      host: 'localhost',
      ports: {
        // exposed:internal
        '9092': '9092',
      },
    }),
  },
})

integration.run()
```
