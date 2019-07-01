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

Check out `example/dockest.ts` for an example usage.

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
  runners: [
    new PostgresRunner({
      database: 'insert-database-here',
      password: 'insert-password-here',
      service: 'insert-service-name-here',
      username: 'insert-username-here',
    }),
  ],
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
  runners: [
    new PostgresRunner({
      database: 'insert-database-here',
      password: 'insert-password-here',
      service: 'insert-service-name-here',
      username: 'insert-username-here',
    }),
  ],
})

dockest.run()
```

# Dockest constructor

```TypeScript
const docker = new Dockest({
  jest,
  runners,
  opts,
})
```

## Jest

### Interface

| Prop      | Required | Type     | Default | Description                                              |
| --------- | -------- | -------- | ------- | -------------------------------------------------------- |
| lib       | true     | object   | -       | The Jest library itself                                  |
| projects  | false    | string[] | ['.']   | https://jestjs.io/docs/en/cli.html#projects-path1-pathn- |
| runInBand | false    | boolean  | true    | https://jestjs.io/docs/en/cli.html#runinband             |

Note that due to Jest running all tests in parallel per default, Dockest defaults the `runInBand` option to `true`. This'll cause jest to run its tests sequentially and thus avoid potential race conditions if tests perform read/write operations on the same entry. The downside of this is an overall longer runtime.

A complete list of CLI-options can be found in [Jest's](https://jestjs.io/docs/en/cli.html) documentation.

## Runners

### [Postgres](https://hub.docker.com/_/postgres)

```TypeScript
new PostgresRunner({
  database: 'insert-database-here',
  password: 'insert-password-here',
  service: 'insert-service-name-here',
  username: 'insert-username-here',
})
```

#### Interface

| Prop                  | Required | Type                | Default     | Description                                                                                                 |
| --------------------- | -------- | ------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| database              | true     | string              | -           | Name of the database                                                                                        |
| password              | true     | string              | -           | Password for user of the database                                                                           |
| service               | true     | string              | -           | Used as an identifiers and, if no image is passed, used to retrieve the image from the user's compose file. |
| username              | true     | string              | -           | User of the database                                                                                        |
| commands              | false    | string[]            | []          | Custom commands that will be executed _once_ upon setup                                                     |
| connectionTimeout     | false    | number              | 3           | How long to wait for the resource to be reachable                                                           |
| dependsOn             | false    | Runner[]            | []          | Defines the [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) of the service         |
| host                  | false    | string              | 'localhost' | Hostname of database                                                                                        |
| image                 | false    | string or undefined | undefined   | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from        |
| port                  | false    | number              | 5432        | Port of database                                                                                            |
| responsivenessTimeout | false    | number              | 10          | How long to wait for the resource to be reachable                                                           |

### [Redis](https://hub.docker.com/_/redis)

```TypeScript
new RedisRunner({
  service: 'insert-docker-compose-service-name-here',
})
```

#### Interface

| Prop                  | Required | Type                | Default     | Description                                                                                                 |
| --------------------- | -------- | ------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| service               | true     | string              | -           | Used as an identifiers and, if no image is passed, used to retrieve the image from the user's compose file. |
| commands              | false    | string[]            | []          | Custom commands that will be executed _once_ upon setup                                                     |
| connectionTimeout     | false    | number              | 3           | How long to wait for the resource to be reachable                                                           |
| dependsOn             | false    | Runner[]            | []          | Defines the [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) of the service         |
| host                  | false    | string              | 'localhost' | Hostname of redis instance                                                                                  |
| image                 | false    | string or undefined | undefined   | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from        |
| password              | false    | string              | ''          | Password to redis instance                                                                                  |
| port                  | false    | number              | 6379        | Port of redis instance                                                                                      |
| responsivenessTimeout | false    | number              | 10          | How long to wait for the resource to be reachable                                                           |

### [ZooKeeper](https://hub.docker.com/r/confluentinc/cp-zookeeper)

```TypeScript
new ZooKeeperRunner({
  port: Number(env.zookeeper1confluentinc_port),
  service: env.zookeeper1confluentinc_service,
})
```

#### Interface

| Prop              | Required | Type                | Default     | Description                                                                                          |
| ----------------- | -------- | ------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| service           | true     | string              | -           | Should match designated docker-compose resource                                                      |
| commands          | false    | string[]            | []          | Custom commands that will be executed _once_ upon setup                                              |
| connectionTimeout | false    | number              | 30          | How long to wait for the resource to be reachable                                                    |
| dependsOn         | false    | Runner[]            | []          | Defines the [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) of the service  |
| host              | false    | string              | 'localhost' | Hostname of zookeeper instance                                                                       |
| image             | false    | string or undefined | undefined   | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from |
| port              | false    | number              | 2181        | This will be the exposed port from your resource                                                     |

### [Kafka](https://hub.docker.com/r/confluentinc/cp-kafka)

```TypeScript
new KafkaRunner({
  service: 'insert-service-name-here',
  dependsOn: [
    new ZooKeeperRunner({
      port: Number(env.zookeeper1confluentinc_port),
      service: env.zookeeper1confluentinc_service,
    }),
  ],
  ports: { '9092': 9092 },
})
```

#### Interface

| Prop              | Required | Type               | Default          | Desciption                                                                                           |
| ----------------- | -------- | ------------------ | ---------------- | ---------------------------------------------------------------------------------------------------- |
| dependsOn         | true     | Runner[]           | []               | Defines the [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) of the service  |
| service           | true     | string             | -                | Should match designated docker-compose resource                                                      |
| autoCreateTopics  | false    | boolean            | true             | Whether or not Kafka should auto-create topics                                                       |
| commands          | false    | string[]           | []               | Custom commands that will be executed _once_ upon setup                                              |
| connectionTimeout | false    | number             | 30               | How long to wait for the resource to be reachable                                                    |
| host              | false    | string             | 'localhost'      | Hostname                                                                                             |
| image             | false    | string             | undefined        | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from |
| port              | false    | number             | 9092             | This will be the exposed port from your resource                                                     |
| ports             | false    | { string: number } | { '9092': 9092 } | Port mappings with format `exposed:inside`                                                           |

## Opts

It's possible to pass custom configuration to Dockest in order to improve developer experience.

### Interface

| Prop            | Required | Type               | Default             | Description                                                                                                                                           |
| --------------- | -------- | ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| afterSetupSleep | false    | number             | 0                   | Additional sleep after initial setup. Useful when resources require additional time to boot                                                           |
| dev             | false    | { debug: boolean } | { debug: false }    | Pauses Jest execution indefinitely. Useful for debugging Jest while resources are running                                                             |
| composeFileName | false    | string             | docker-compose.yml  | The name of your Compose file. This is required if you do **not** pass the image property for each Runner                                             |
| exitHandler     | false    | function           | null                | Callback that will run before exit. Recieved one argument of type { type: string, code?: number, signal?: any, error?: Error, reason?: any, p?: any } |
| logLevel        | false    | number             | 2 (logLevel.NORMAL) | Sets the log level between 0 and 4                                                                                                                    |
| runInBand       | false    | boolean            | true                | Initializes and runs the Runners in sequence. Disabling this could increase performance                                                               |

# Contributing

## Setup and running tests

- `yarn dev:setup`: Installs all dependencies and necessary git-hooks
- `yarn test:all`: Runs `yarn test` and `yarn test:example`
  - `yarn test`: Unit tests for the library itself
  - `yarn test:example`: Integration tests using Dockest

# License

MIT
