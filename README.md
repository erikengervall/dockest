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
  runners: [
    new PostgresRunner({
      service: 'insert-service-name-here',
      database: 'insert-database-here',
      password: 'insert-password-here',
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
  runners: [
    new PostgresRunner({
      service: 'insert-service-name-here',
      database: 'insert-database-here',
      password: 'insert-password-here',
      username: 'insert-username-here',
    }),
  ],
})

dockest.run()
```

# Dockest constructor

```TypeScript
const docker = new Dockest({
  runners,
  jest,
  opts,
})
```

## Runners

### [Postgres](https://hub.docker.com/_/postgres)

```TypeScript
const opts = {
  service: 'insert-service-name-here',
  database: 'insert-database-here',
  password: 'insert-password-here',
  username: 'insert-username-here',
}

new PostgresRunner(opts)
```

#### opts

| Prop                  | Required | Type                      | Default            | Description                                                                                          |
| --------------------- | -------- | ------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| service               | true     | string                    | -                  | Used as an identifiers and, if no `image` option is passed, to find the image from your Compose file |
| database              | true     | string                    | -                  | Database's name                                                                                      |
| password              | true     | string                    | -                  | Database's password                                                                                  |
| username              | true     | string                    | -                  | Database's username                                                                                  |
| commands              | false    | string[]                  | []                 | Custom commands that execute _once_ after service responsiveness has been established                |
| connectionTimeout     | false    | number                    | 3                  | How long to wait for the resource to be reachable                                                    |
| dependsOn             | false    | Runner[]                  | []                 | Defines the [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) of the service  |
| host                  | false    | string                    | 'localhost'        | Hostname of database                                                                                 |
| image                 | false    | string or undefined       | undefined          | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from |
| ports                 | false    | { [key: string]: string } | { '5432': '5432' } | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#short-syntax-1)          |
| responsivenessTimeout | false    | number                    | 10                 | How long to wait for the resource to be reachable                                                    |

#### static members

| static member | Type   | Value       |
| ------------- | ------ | ----------- |
| DEFAULT_HOST  | string | 'localhost' |
| DEFAULT_PORT  | string | '5432'      |

### [Redis](https://hub.docker.com/_/redis)

```TypeScript
const opts = {
  service: 'insert-docker-compose-service-name-here',
}

new RedisRunner(opts)
```

#### opts

| Prop                  | Required | Type                      | Default            | Description                                                                                          |
| --------------------- | -------- | ------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| service               | true     | string                    | -                  | Used as an identifiers and, if no `image` option is passed, to find the image from your Compose file |
| commands              | false    | string[]                  | []                 | Custom commands that execute _once_ after service responsiveness has been established                |
| connectionTimeout     | false    | number                    | 3                  | How long to wait for the resource to be reachable                                                    |
| dependsOn             | false    | Runner[]                  | []                 | Defines the [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) of the service  |
| host                  | false    | string                    | 'localhost'        | Hostname of redis instance                                                                           |
| image                 | false    | string or undefined       | undefined          | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from |
| password              | false    | string                    | ''                 | Password to redis instance                                                                           |
| ports                 | false    | { [key: string]: string } | { '6379': '6379' } | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#short-syntax-1)          |
| responsivenessTimeout | false    | number                    | 10                 | How long to wait for the resource to be reachable                                                    |

#### static members

| static member | Type   | Value       |
| ------------- | ------ | ----------- |
| DEFAULT_HOST  | string | 'localhost' |
| DEFAULT_PORT  | string | '6379'      |

### [ZooKeeper](https://hub.docker.com/r/confluentinc/cp-zookeeper)

```TypeScript
const opts = {
  service: env.zookeeper1confluentinc_service,
  port: Number(env.zookeeper1confluentinc_port),
}

new ZooKeeperRunner(opts)
```

#### opts

| Prop              | Required | Type                      | Default            | Description                                                                                          |
| ----------------- | -------- | ------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| service           | true     | string                    | -                  | Used as an identifiers and, if no `image` option is passed, to find the image from your Compose file |
| commands          | false    | string[]                  | []                 | Custom commands that execute _once_ after service responsiveness has been established                |
| connectionTimeout | false    | number                    | 30                 | How long to wait for the resource to be reachable                                                    |
| dependsOn         | false    | Runner[]                  | []                 | Defines the [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) of the service  |
| host              | false    | string                    | 'localhost'        | Hostname of zookeeper instance                                                                       |
| image             | false    | string or undefined       | undefined          | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from |
| ports             | false    | { [key: string]: string } | { '2181': '2181' } | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#short-syntax-1)          |

#### static members

| static member | Type   | Value       |
| ------------- | ------ | ----------- |
| DEFAULT_HOST  | string | 'localhost' |
| DEFAULT_PORT  | string | '2181'      |

### [Kafka](https://hub.docker.com/r/confluentinc/cp-kafka)

```TypeScript
const opts = {
  service: 'insert-service-name-here',
  dependsOn: [
    new ZooKeeperRunner({
      service: env.zookeeper1confluentinc_service,
      port: Number(env.zookeeper1confluentinc_port),
    }),
  ],
  ports: { '9092': 9092 },
}

new KafkaRunner(opts)
```

#### opts

| Prop              | Required | Type                      | Default            | Desciption                                                                                           |
| ----------------- | -------- | ------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| service           | true     | string                    | -                  | Used as an identifiers and, if no `image` option is passed, to find the image from your Compose file |
| dependsOn         | true     | Runner[]                  | []                 | Defines the service's [dependencies](https://docs.docker.com/compose/compose-file/#depends_on)       |
| autoCreateTopics  | false    | boolean                   | true               | Whether or not Kafka should auto-create topics                                                       |
| commands          | false    | string[]                  | []                 | Custom commands that execute _once_ after service responsiveness has been established                |
| connectionTimeout | false    | number                    | 30                 | How long to wait for the resource to be reachable                                                    |
| host              | false    | string                    | 'localhost'        | Hostname                                                                                             |
| image             | false    | string                    | undefined          | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from |
| ports             | false    | { [key: string]: string } | { '9092': '9092' } | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#short-syntax-1)          |

#### static members

| static member                | Type   | Value       |
| ---------------------------- | ------ | ----------- |
| DEFAULT_HOST                 | string | 'localhost' |
| DEFAULT_PORT_PLAINTEXT       | string | '9092'      |
| DEFAULT_PORT_SASL_SSL        | string | '9094'      |
| DEFAULT_PORT_SCHEMA_REGISTRY | string | '8081'      |
| DEFAULT_PORT_SSL             | string | '9093'      |

## Jest

### Interface

| Prop      | Required | Type     | Default | Description                                                                                                             |
| --------- | -------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| lib       | false    | object   | -       | The Jest library itself, typically passed as { lib: require('jest') }. If ommitted, the Dockest dependency will be used |
| projects  | false    | string[] | ['.']   | https://jestjs.io/docs/en/cli.html#projects-path1-pathn-                                                                |
| runInBand | false    | boolean  | true    | https://jestjs.io/docs/en/cli.html#runinband                                                                            |

Note that due to Jest running all tests in parallel per default, Dockest defaults the `runInBand` option to `true`. This'll cause jest to run its tests sequentially and thus avoid potential race conditions if tests perform read/write operations on the same entry. The downside of this is an overall longer runtime.

A complete list of CLI-options can be found in [Jest's](https://jestjs.io/docs/en/cli.html) documentation.

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
