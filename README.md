# Dockest

Dockest is an integration testing tool aimed at alleviating the process of evaluating unit tests whilst running multi-container Docker applications.

<p align="center">
  <img alt="dockest logo" src="https://raw.githubusercontent.com/erikengervall/dockest/master/dev-toolbox/logo/pinterest_profile_image.png">
</p>

<p align="center">
  <a href="https://travis-ci.com/erikengervall/dockest">
    <img alt="licence" src="https://img.shields.io/travis/com/erikengervall/dockest.svg?style=flat">
  </a>
  <a href="https://www.npmjs.com/package/dockest">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/dockest.svg?style=flat">
  </a>
  <a href="https://github.com/erikengervall/dockest/blob/master/LICENSE">
    <img alt="licence" src="https://img.shields.io/npm/l/dockest.svg?style=flat">
  </a>
<p>

## Requirements

- At least Jest **v20.0.0** because Dockest calls Jest's CLI programmatically
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/) (_"On desktop systems like Docker Desktop for Mac and Windows, Docker Compose is included as part of those desktop installs."_)

## Usage

Check out `example/dockest.ts` for an example usage implemented in TypeScript.

### TypeScript

`jest.config.js`

```JavaScript
module.exports = {
  preset: 'ts-jest',
}
```

`package.json`

```JSON
{
  "scripts": {
    "test": "ts-node ./dockest.ts"
  },
  "devDependencies": {
    "ts-jest": "^23.10.5",
    "ts-node": "^8.0.2"
  }
}
```

`dockest.ts`

```TypeScript
import Dockest, { runners } from 'dockest'

const { PostgresRunner } = runners

const dockest = new Dockest({
  jest: {
    lib: require('jest'),
  },
  runners: {
    postgres: new PostgresRunner({
      service: 'insert-docker-compose-service-name-here',
      database: 'insert-database-here',
      username: 'insert-username-here',
      password: 'insert-password-here',
    }),
  },
})

dockest.run()
```

### Javascript

`dockest.js`

```JavaScript
const {
  default: Dockest,
  runners: { PostgresRunner },
} = require('dockest')

const dockest = new Dockest({
  jest: {
    lib: require('jest'),
  },
  runners: {
    postgres: new PostgresRunner({
      service: 'insert-docker-compose-service-name-here',
      database: 'insert-database-here',
      username: 'insert-username-here',
      password: 'insert-password-here',
    }),
  },
})

dockest.run()
```

# Dockest constructor

```TypeScript
const docker = new Dockest({
  ...opts,
  jest,
  runners,
})
```

## Opts

It's possible to pass custom configuration to Dockest in order to improve developer experience.

### Interface

| Prop            | Required | Type     | Default             | Description                                                                                                                                                                       |
| --------------- | -------- | -------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logLevel        | false    | number   | 2 (logLevel.NORMAL) | Sets the log level between 0 and 4                                                                                                                                                |
| exitHandler     | false    | function | null                | Custom function which will be invoced upon exiting the process with an error payload of type: { type: string, code?: number, signal?: any, error?: Error, reason?: any, p?: any } |
| afterSetupSleep | false    | number   | 0                   | Additional sleep after initial setup                                                                                                                                              |

## Jest

### Interface

| Prop      | Required | Type     | Default   | Description                                              |
| --------- | -------- | -------- | --------- | -------------------------------------------------------- |
| lib       | true     | object   | -         | The Jest library itself                                  |
| projects  | false    | string[] | ['.']     | https://jestjs.io/docs/en/cli.html#projects-path1-pathn- |
| runInBand | false    | boolean  | true      | https://jestjs.io/docs/en/cli.html#runinband             |
| silent    | false    | boolean  | undefined | https://jestjs.io/docs/en/cli.html#silent                |
| verbose   | false    | boolean  | undefined | https://jestjs.io/docs/en/cli.html#verbose               |
| forceExit | false    | boolean  | undefined | https://jestjs.io/docs/en/cli.html#forceexit             |
| watchAll  | false    | boolean  | undefined | https://jestjs.io/docs/en/cli.html#watchall              |

Note that due to Jest running all tests in parallel per default, Dockest defaults the `runInBand` option to `true`. This'll cause jest to run its tests sequentially and thus avoid potential race conditions if tests perform read/write operations on the same entry. The downside of this is an overall longer runtime.

## Runners

### [Postgres](https://hub.docker.com/_/postgres)

```TypeScript
new PostgresRunner({
  service: 'insert-docker-compose-service-name-here',
  database: 'insert-database-here',
  username: 'insert-username-here',
  password: 'insert-password-here',
})
```

#### Interface

| Prop                  | Required | Type     | Default     | Description                                             |
| --------------------- | -------- | -------- | ----------- | ------------------------------------------------------- |
| service               | true     | string   | -           | Should match designated docker-compose resource         |
| database              | true     | string   | -           | Name of the database                                    |
| username              | true     | string   | -           | User of the database                                    |
| password              | true     | string   | -           | Password for user of the database                       |
| host                  | false    | string   | 'localhost' | Hostname of database                                    |
| port                  | false    | number   | 5432        | Port of database                                        |
| commands              | false    | string[] | []          | Custom commands that will be executed _once_ upon setup |
| connectionTimeout     | false    | number   | 3           | How long to wait for the resource to be reachable       |
| responsivenessTimeout | false    | number   | 10          | How long to wait for the resource to be reachable       |

#### Helpers

Available helpers

- runHelpCmd: Runs a custom command

Example

```JavaScript
const {
  runners: { PostgresRunner },
} = require('dockest')
const postgresHelpers = PostgresRunner.getHelpers({ verbose: true })

beforeAll(async () => {
  await postgresHelpers.runHelpCmd('yarn sequelize db:seed:undo:all && yarn sequelize db:seed --seed 20180101133337-seed-name')
})
```

### [Redis](https://hub.docker.com/_/redis)

```TypeScript
new RedisRunner({
  service: 'insert-docker-compose-service-name-here',
})
```

#### Interface

| Prop                  | Required | Type     | Default     | Description                                             |
| --------------------- | -------- | -------- | ----------- | ------------------------------------------------------- |
| service               | true     | string   | -           | Should match designated docker-compose resource         |
| host                  | false    | string   | 'localhost' | Hostname of redis instance                              |
| port                  | false    | number   | 6379        | Port of redis instance                                  |
| password              | false    | string   | ''          | Password to redis instance                              |
| commands              | false    | string[] | []          | Custom commands that will be executed _once_ upon setup |
| connectionTimeout     | false    | number   | 3           | How long to wait for the resource to be reachable       |
| responsivenessTimeout | false    | number   | 10          | How long to wait for the resource to be reachable       |

### (WIP) [Kafka](https://hub.docker.com/r/confluentinc/cp-kafka)

```TypeScript
new KafkaRunner({
  service: 'kafka1confluentinc',
  topics: ['topic:1:1'], // topicName:partitions:replicas
  ports: {
    '9092': '9092', // kafka
    '9093': '9093', // kafka
    '9094': '9094', // kafka
  },
})
```

#### Zookepeer Interface

| Prop              | Required | Type   | Default | Description                                       |
| ----------------- | -------- | ------ | ------- | ------------------------------------------------- |
| service           | true     | string | -       | Should match designated docker-compose resource   |
| port              | false    | number | 2181    | This will be the exposed port from your resource  |
| connectionTimeout | false    | number | 30      | How long to wait for the resource to be reachable |

#### Kafka Interface

| Prop              | Required | Type                  | Default                                            | Desciption                                                         |
| ----------------- | -------- | --------------------- | -------------------------------------------------- | ------------------------------------------------------------------ |
| service           | true     | string                | -                                                  | Should match designated docker-compose resource                    |
| topics            | true     | string[]              | -                                                  | Topics for testing                                                 |
| zookeeperConnect  | false    | string                | -                                                  | host:port connection configuration towards your Zookeeper instance |
| host              | false    | string                | 'localhost'                                        | Hostname                                                           |
| ports             | false    | object{string:string} | { '9092': '9092', '9093': '9093', '9094': '9094' } | Port mappings with format `external:inside container`              |
| autoCreateTopics  | false    | boolean               | true                                               | Whether or not Kafka should auto-create topics                     |
| connectionTimeout | false    | number                | 30                                                 | How long to wait for the resource to be reachable                  |

## Contributing

### Setup and running tests

- `yarn dev:setup`: Installs all dependencies and necessary git-hooks
- `yarn test:all`: Runs `yarn test:unit:dockest` and `yarn test:integration:example`
  - `yarn test:unit:dockest`: Trivial unit tests for the library itself
  - `yarn test:integration:example`: Runs Dockest from the example

### Overview

When calling Dockest, the following chain of events occur

- `index.ts`: Setup each Runner
  - `BaseRunner.ts`: Start the container
  - `BaseRunner.ts`: Healthcheck the container (connectivity and/or responsiveness)
- `index.ts`: Call the Jest Runner
  - `jest.ts` Run Jest programmatically from its CLI interface
- `index.ts`: Teardown each container
  - `BaseRunner.ts`: Stop container
  - `BaseRunner.ts`: Remove container
- `index.ts` Exit process with an exit code corresponding to the result from Jest

The BaseRunner contains all the methods required in order to start, healthcheck and teardown containers. The Runners' transform the configuration provided by the users and, by extending from the BaseRunner, calls its methods with arguments constructed with the supplied configuration. This way, the Runners' responsibilities are limited to constructing arguments to be interpreted by the BaseRunner, which makes the implementation of future Runners easier.

## License

MIT
