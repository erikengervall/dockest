# Dockest

Dockest is an integration testing tool aimed at alleviating the process of evaluating unit tests whilst running
multi-container Docker applications.

<p align="center">
  <a href="https://github.com/erikengervall/dockest"><img alt="dockest logo" width="300px" src="https://raw.githubusercontent.com/erikengervall/dockest/master/resources/img/logo.png"></a>
</p>

<br>
<br>

<p align="center">
  <a href="https://github.com/erikengervall/dockest/actions/workflows/nodejs.yml">
    <img alt="Node.js CI" src="https://github.com/erikengervall/dockest/workflows/Node.js%20CI/badge.svg">
  </a>

  <a href="https://www.npmjs.com/package/dockest">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/dockest">
  </a>

  <a href="https://github.com/erikengervall/dockest/blob/master/LICENSE">
    <img alt="licence" src="https://img.shields.io/npm/l/dockest">
  </a>

  <a href="https://snyk.io/test/github/erikengervall/dockest">
    <img alt="snyk" src="https://snyk.io/test/github/erikengervall/dockest/badge.svg">
  </a>
<p>

# Table of contents

- [Table of contents](#table-of-contents)
- [Introduction](#introduction)
- [Basic usage](#basic-usage)
- [How a run works](#how-a-run-works)
- [API Reference](#api-reference)
- [Compose file](#compose-file)
- [Running Dockest inside a container](#running-dockest-inside-a-container)
- [Versioned Documentation](#versioned-documentation)
- [Contributing / development](#contributing--development)
- [Acknowledgements](#acknowledgements)
- [License](#license)

# Introduction

## Motivation

The original motivation for Dockest, along with real world examples, can be read in this
[blog article](https://engineering.klarna.com/node-js-integration-testing-with-ease-fab5f8d29163).

> Dockest was born out of frustration and with a vision to make developers' lives slightly less miserable.

Dockest provides an abstraction for your Docker services' lifecycles during integration testing, freeing developers from
convoluted and flaky shell scripts. Adopting Dockest is easy regardless if you've got existing tests or not and doesn't
necessarily require additional CI pipeline steps.

## Why Dockest

The value that Dockest provides over e.g. plain Docker Compose is that it figures out the connectivity and
responsiveness status of each individual service (either sequentially or concurrently) and once all services are ready
the tests run. When the run ends, fails or is interrupted, Dockest removes what it started.

## Example use cases

Working examples live under
[`packages/examples`](https://github.com/erikengervall/dockest/tree/master/packages/examples):

- [`multiple-resources`](https://github.com/erikengervall/dockest/tree/master/packages/examples/multiple-resources):
  PostgreSQL (Sequelize and Knex), Redis and Kafka with ZooKeeper in one run
- [`multiple-compose-files`](https://github.com/erikengervall/dockest/tree/master/packages/examples/multiple-compose-files):
  services spread over several Compose files
- [`node-to-node`](https://github.com/erikengervall/dockest/tree/master/packages/examples/node-to-node): Dockest builds
  and runs application services as part of the integration tests
- [`docker-in-docker`](https://github.com/erikengervall/dockest/tree/master/packages/examples/docker-in-docker): a
  Docker daemon inside a container runs the services
- [`aws-codebuild`](https://github.com/erikengervall/dockest/tree/master/packages/examples/aws-codebuild): runs the
  tests in [AWS CodeBuild](https://aws.amazon.com/codebuild), locally through the
  [CodeBuild local agent](https://hub.docker.com/r/amazon/aws-codebuild-local)

# Basic usage

## System requirements

- [Node.js](https://nodejs.org/) **18** or newer
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/) **v2**. Dockest uses the `docker compose` plugin when it is
  available and falls back to the standalone `docker-compose` binary. Docker Desktop ships the plugin.
- [Jest](https://jestjs.io/) **20** or newer, installed by your project. Jest is a peer dependency: Dockest runs it
  through Jest's programmatic CLI and does not bring its own copy.

## Install

```bash
yarn add --dev dockest jest
# npm install --save-dev dockest jest
```

## Application code

```ts
// cache.ts
import type Redis from 'ioredis';

export const cacheKey = 'arbitraryNumberKey';

export const setCache = (redisClient: Redis, arbitraryNumber: number) => redisClient.set(cacheKey, arbitraryNumber);
```

### Integration test

```ts
// cache.spec.ts
import Redis from 'ioredis'; // ... or client of choice
import { resolveServiceAddress } from 'dockest/test-helper';
import { cacheKey, setCache } from './cache';

// Resolves the address of the `myRedis` service's container port 6379, see the Compose file below
const { host, port } = resolveServiceAddress('myRedis', 6379);
const redisClient = new Redis({ host, port });

afterAll(() => redisClient.quit());

it('should cache an arbitrary number', async () => {
  await setCache(redisClient, 5);

  const cachedValue = await redisClient.get(cacheKey);
  expect(cachedValue).toEqual('5');
});
```

### Compose file and Dockest script

Turn the test into an integration test by adding a `docker-compose.yml` and a `dockest.ts` file.

```yml
# docker-compose.yml
services:
  myRedis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
```

```ts
// dockest.ts
import { Dockest, logLevel } from 'dockest';
import { createRedisReadinessCheck } from 'dockest/readiness-check';

const { run } = new Dockest({
  composeFile: 'docker-compose.yml',
  jestLib: require('jest'),
  logLevel: logLevel.INFO,
});

// The services from the Compose file that the integration tests need
run([
  {
    serviceName: 'myRedis', // Must match a service in the Compose file
    readinessCheck: createRedisReadinessCheck(),
  },
]);
```

### Configure scripts

Configure `package.json` to run `dockest.ts`. [`ts-node`](https://www.npmjs.com/package/ts-node) is recommended for
TypeScript projects.

```json
{
  "scripts": {
    "test": "ts-node ./dockest"
  },
  "devDependencies": {
    "dockest": "...",
    "jest": "...",
    "ts-node": "..."
  }
}
```

### Run

```sh
yarn test
```

Dockest exits with `0` when every test passes and with a non-zero code otherwise.

Dockest writes `docker-compose.dockest-generated.yml` and (with the default `containerLogs`) `dockest.log` to the
working directory, and `dockest-error.json` when `dumpErrors` is set. Add them to your `.gitignore`.

# How a run works

1. The Compose file(s) are merged and normalized with `docker compose config` and written to
   `docker-compose.dockest-generated.yml`.
2. Each Dockest service is started with `docker compose up --detach <serviceName>`. With `runInBand` (the default),
   services start one at a time and every service starts after the services it `dependsOn` are ready.
3. For each service, Dockest checks that its ports accept TCP connections (unless `skipCheckConnection` is set), runs
   its `readinessCheck`, then runs its `commands`.
4. Jest runs.
5. Dockest stops and removes the containers it started (with their anonymous volumes) and the networks the Compose
   project created, then exits.

Teardown also happens when the run fails, when the process is interrupted (Ctrl+C, `SIGINT`), receives `SIGTERM` (e.g. a
cancelled CI job), `SIGUSR1` or `SIGUSR2`, or hits an uncaught exception or unhandled rejection. In those cases
`exitHandler` is called first. A network that is still in use by containers outside Dockest is left alone.

# API Reference

## Dockest

```ts
import { Dockest } from 'dockest';

const { run } = new Dockest(opts);
```

`opts` is optional, i.e. the constructor can be called without arguments. The constructor throws if the Jest version
from `jestLib` is older than 20.

### DockestOpts

| property                                               | type                                   | default                                                |
| ------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------ |
| [composeFile](#dockestoptscomposefile)                 | `string \| string[]`                   | `'docker-compose.yml'`                                 |
| [composeOpts](#dockestoptscomposeopts)                 | `object`                               | every flag `false`                                     |
| [containerLogs](#dockestoptscontainerlogs)             | `object`                               | `{ modes: ['aggregate'], logPath: './' }`              |
| [debug](#dockestoptsdebug)                             | `boolean`                              | `false`                                                |
| [dumpErrors](#dockestoptsdumperrors)                   | `boolean`                              | `false`                                                |
| [exitHandler](#dockestoptsexithandler)                 | `null \| (error: ErrorPayload) => any` | a no-op async function                                 |
| [jestLib](#dockestoptsjestlib)                         | the `jest` module                      | `require('jest')`, i.e. the Jest your project installs |
| [jestOpts](#dockestoptsjestopts)                       | `object`                               | `{ projects: ['.'], runInBand: true }`                 |
| [logLevel](#dockestoptsloglevel)                       | `number`                               | `logLevel.INFO`, i.e. `3`                              |
| [runInBand](#dockestoptsruninband)                     | `boolean`                              | `true`                                                 |
| [skipCheckConnection](#dockestoptsskipcheckconnection) | `boolean`                              | `false`                                                |

#### `DockestOpts.composeFile`

Path to the Compose file, or an array of paths that are merged in order (like repeating `-f`). Relative paths resolve
from the working directory.

#### `DockestOpts.composeOpts`

| property           | description                                                                                     | type      | default |
| ------------------ | ----------------------------------------------------------------------------------------------- | --------- | ------- |
| alwaysRecreateDeps | Recreate dependent containers. Incompatible with `--no-recreate`                                | `boolean` | `false` |
| build              | Build images before starting containers                                                         | `boolean` | `false` |
| forceRecreate      | Recreate containers even if their configuration and image haven't changed                       | `boolean` | `false` |
| noBuild            | Don't build an image, even if it's missing                                                      | `boolean` | `false` |
| noColor            | Produce monochrome output                                                                       | `boolean` | `false` |
| noDeps             | Don't start linked services                                                                     | `boolean` | `false` |
| noRecreate         | If containers already exist, don't recreate them. Incompatible with `--force-recreate` and `-V` | `boolean` | `false` |
| quietPull          | Pull without printing progress information                                                      | `boolean` | `false` |

Each option forwards the matching flag to `docker compose up`, see
[Docker's docs](https://docs.docker.com/reference/cli/docker/compose/up/).

#### `DockestOpts.containerLogs`

| property          | description                            | type                                                | default         |
| ----------------- | -------------------------------------- | --------------------------------------------------- | --------------- |
| modes             | How container logs are collected       | `('per-service' \| 'aggregate' \| 'pipe-stdout')[]` | `['aggregate']` |
| serviceNameFilter | Only collect logs for these services   | `string[]`                                          | all services    |
| logPath           | Directory the log files are written to | `string`                                            | `'./'`          |

Modes can be combined:

- `'aggregate'`: one `dockest.log` for all services
- `'per-service'`: one `<serviceName>.dockest.log` per service
- `'pipe-stdout'`: pipe the logs to stdout

#### `DockestOpts.debug`

Starts the services, logs each service's container id, then keeps the containers running instead of running Jest. Useful
for running Jest manually against the services. Also enabled when the process arguments include `dev` or `debug`, e.g.
`ts-node ./dockest debug`.

#### `DockestOpts.dumpErrors`

Serializes the error that ended the run and writes it to `dockest-error.json` in the working directory. Useful for
debugging.

#### `DockestOpts.exitHandler`

Called before teardown when the run fails or is interrupted (not after a regular run). It receives an `ErrorPayload`:

```ts
interface ErrorPayload {
  trap: string; // what caught it: 'run', 'SIGINT', 'SIGTERM', 'uncaughtException', 'unhandledRejection', 'exit', ...
  code?: number;
  error?: Error;
  promise?: Promise<any>;
  reason?: Error | any;
  signal?: any;
}
```

A returned promise is awaited before teardown, except on the `exit` trap, where Node only runs synchronous code.

#### `DockestOpts.jestLib`

The Jest module itself, e.g. `require('jest')`. Pass it when Dockest should use a specific Jest installation. When
omitted, Dockest requires `jest`, which resolves to the Jest your project installs.

#### `DockestOpts.jestOpts`

Options passed to Jest's `runCLI`, i.e. Jest's [CLI options](https://jestjs.io/docs/cli) in camelCase. Merged over the
defaults `{ projects: ['.'], runInBand: true }`. Jest runs test files in parallel by default; Dockest defaults Jest's
`runInBand` to `true` so tests sharing the same services don't race each other. This may lead to longer runtimes.

#### `DockestOpts.logLevel`

How much Dockest logs, from `logLevel.NOTHING` (`0`) to `logLevel.DEBUG` (`4`). See [`logLevel`](#loglevel-object).

#### `DockestOpts.runInBand`

Starts and checks the services one at a time, in `dependsOn` order. Setting it to `false` starts every service
concurrently, which can be faster but does not wait for dependencies.

#### `DockestOpts.skipCheckConnection`

Skips the TCP connectivity check of every service's ports. The `readinessCheck` still runs.

## Run

`run` takes the Dockest services, starts them, runs Jest, tears down and exits the process: `0` when all tests passed,
non-zero otherwise.

```ts
import { Dockest, DockestService } from 'dockest';
import { createPostgresReadinessCheck, createRedisReadinessCheck } from 'dockest/readiness-check';

const { run } = new Dockest();

const dockestServices: DockestService[] = [
  {
    serviceName: 'api',
    dependsOn: [
      { serviceName: 'postgres', readinessCheck: createPostgresReadinessCheck() },
      { serviceName: 'redis', readinessCheck: createRedisReadinessCheck() },
    ],
    commands: ['echo "postgres and redis are ready, so is the api"'],
  },
];

run(dockestServices);
```

## DockestService

Dockest services map to services declared in the Compose file(s).

| property                                        | type                                              | default                   |
| ----------------------------------------------- | ------------------------------------------------- | ------------------------- |
| **[serviceName](#dockestserviceservicename)**   | `string`                                          | required                  |
| [commands](#dockestservicecommands)             | `(string \| ((containerId: string) => string))[]` | `[]`                      |
| [dependsOn](#dockestservicedependson)           | `DockestService[]`                                | `[]`                      |
| [readinessCheck](#dockestservicereadinesscheck) | `ReadinessCheck`                                  | `() => Promise.resolve()` |

### `DockestService.serviceName`

The name of the corresponding service in your Compose file. Dockest throws a `ConfigurationError` if the Compose file
has no such service.

### `DockestService.commands`

Shell commands that run once the service is ready, e.g. database migrations. They run in a shell on the machine running
Dockest, not inside the container, one after another, and a failing command fails the run.

A command is either a string or a function that receives the service's container id and returns a string:

```ts
const dockestService: DockestService = {
  serviceName: 'postgres',
  commands: ['knex migrate:latest', (containerId) => `docker exec ${containerId} psql -U postgres -c 'select 1'`],
};
```

### `DockestService.dependsOn`

The Dockest services this service depends on. They are started and fully ready before this service is started.

```ts
const dockestServices: DockestService[] = [
  {
    serviceName: 'service1',
    dependsOn: [
      {
        serviceName: 'service2',
      },
    ],
  },
];
```

`service2` starts up and is fully responsive before `service1` is started. The order applies with `runInBand: true` (the
default).

> Why not rely on the Compose file's `depends_on`?

By default `depends_on` only waits for the dependency's container to start, not for the service inside it to be ready
([Docker's docs](https://docs.docker.com/compose/how-tos/startup-order/)). `dependsOn` waits for the dependency's
connectivity and readiness checks.

### `DockestService.readinessCheck`

Decides when a service is ready (or "responsive"), e.g. by querying a database with `select 1`. It runs after the
connectivity check and before `commands`. The service is ready when the returned promise resolves or the returned
[RxJS](https://rxjs.dev/) observable completes; a rejection or error fails the run.

```ts
import { DockestService } from 'dockest';

const dockestService: DockestService = {
  serviceName: 'service1',
  readinessCheck: async ({ runner }) => {
    runner.logger.info(`Checking container ${runner.containerId}`);
    // implement your readinessCheck...
  },
};
```

The readiness check receives one argument, `{ runner }`, where `runner` has:

| property                 | description                                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| containerId              | The Docker [container's id](https://docs.docker.com/engine/containers/run/#container-identification).                                                      |
| serviceName              | The service's name.                                                                                                                                        |
| dockerComposeFileService | The service's configuration from the merged Compose file, e.g. `environment`. `ports` are always in long form: `{ published?: number, target: number }[]`. |
| dockerEventStream$       | An RxJS observable of the Docker events (`start`, `health_status`, `die`, `kill`, ...) for this service.                                                   |
| logger                   | A logger (`debug`, `info`, `warn`, `error`) that prefixes every line with the service name.                                                                |
| host                     | The service's host name in [docker-in-docker mode](#running-dockest-inside-a-container) (the service name); `undefined` otherwise.                         |

## Readiness checks

`dockest/readiness-check` ships ready-made checks and two wrappers to build your own.

```ts
import {
  containerIsHealthyReadinessCheck,
  createPostgresReadinessCheck,
  createRedisReadinessCheck,
  createWebReadinessCheck,
  withNoStop,
  withRetry,
  zeroExitCodeReadinessCheck,
} from 'dockest/readiness-check';
```

The retry count is set per check: pass `retryCount` to a `create*` check or to `withRetry`. There is no global retry
option.

### `createPostgresReadinessCheck({ config?, retryCount? })`

Runs `psql -c 'select 1'` inside the container (`docker exec`, needs `bash` and `psql` in the image) until it succeeds.
`config` is `{ POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD? }` or a function `(runner) => config` (may return a
promise). It defaults to the service's `POSTGRES_DB`, `POSTGRES_USER` and `POSTGRES_PASSWORD` environment from the
Compose file, as used by the [official image](https://hub.docker.com/_/postgres). `retryCount` defaults to `30`.

```yml
# docker-compose.yml
services:
  postgres: # (1)
    image: postgres:16-alpine
    ports:
      - published: 5432
        target: 5432
    environment: # (2)
      POSTGRES_DB: baby
      POSTGRES_USER: dont
      POSTGRES_PASSWORD: hurtme
```

```ts
// dockest.ts
import { Dockest } from 'dockest';
import { createPostgresReadinessCheck } from 'dockest/readiness-check';

const { run } = new Dockest();

run([
  {
    serviceName: 'postgres', // must match (1)
    readinessCheck: createPostgresReadinessCheck(), // reads (2)
  },
]);
```

### `createRedisReadinessCheck({ port?, retryCount? })`

Runs `redis-cli PING` inside the container until it succeeds. Works with the
[official image](https://hub.docker.com/_/redis). `port` is the container port, a number or a function
`(runner) => number` (may return a promise), default `6379`. `retryCount` defaults to `30`.

```ts
run([
  {
    serviceName: 'redis',
    readinessCheck: createRedisReadinessCheck(),
  },
]);
```

### `createWebReadinessCheck({ port?, retryCount? })`

Runs `wget --spider http://localhost:<port>/.well-known/healthcheck` inside the container until it succeeds, so the
image needs `wget` (e.g. an Alpine or BusyBox based image) and the web service must answer on that path. `port` is the
container port, a number or a function `(runner) => number` (may return a promise), default `3000`. `retryCount`
defaults to `30`.

```ts
run([
  {
    serviceName: 'web',
    readinessCheck: createWebReadinessCheck({ port: 8080 }),
  },
]);
```

### `containerIsHealthyReadinessCheck`

Waits until Docker reports the container as `healthy`. The service needs a
[`healthcheck`](https://docs.docker.com/reference/compose-file/services/#healthcheck) in the Compose file or image.

### `zeroExitCodeReadinessCheck`

Waits until the container exits with exit code `0`, for one-off services such as a migration job. A non-zero exit code
or a kill fails the run.

### `withRetry(readinessCheck, { retryCount })`

Retries a failing readiness check up to `retryCount` times, one second apart, then fails the run.

### `withNoStop(readinessCheck)`

Fails the readiness check as soon as the container dies or is killed, instead of waiting for it to time out. The
`create*` checks and `containerIsHealthyReadinessCheck` are already wrapped.

```ts
import { execa } from 'dockest';
import { withNoStop, withRetry } from 'dockest/readiness-check';

const mysqlReadinessCheck = withNoStop(
  withRetry(
    async ({ runner }) => {
      execa(`docker exec ${runner.containerId} mysqladmin ping --silent`, { runner });
    },
    { retryCount: 20 },
  ),
);
```

## Test helper

`dockest/test-helper` resolves service addresses from inside your tests. It reads the configuration Dockest attaches to
the process, so importing it outside a Dockest run throws.

```ts
import { getHostAddress, getServiceAddress, resolveServiceAddress } from 'dockest/test-helper';

const { host, port } = resolveServiceAddress('postgres', 5432); // e.g. { host: 'localhost', port: 5432 }
const redisAddress = getServiceAddress('redis', '6379'); // e.g. 'localhost:6379'
```

### `resolveServiceAddress(serviceName, targetPort)`

Returns `{ host, port }` for the service's container port `targetPort` (a number or a string). Outside docker-in-docker
mode that is `localhost` and the published host port; in docker-in-docker mode it is the service name and the container
port. It throws if the service doesn't exist, has no such target port, or (outside docker-in-docker mode) the port has
no fixed host port, e.g. `- '6379'`.

### `getServiceAddress(serviceName, targetPort)`

Same as `resolveServiceAddress`, formatted as `"host:port"`.

### `getHostAddress()`

The host name containers use to reach the machine running the tests (e.g. a server your test starts):
`host.docker.internal`, or `host.dockest-runner.internal` in docker-in-docker mode.

## Utils

### `logLevel` object

Helper constant for `DockestOpts.logLevel`.

```ts
import { logLevel } from 'dockest';

console.log(logLevel);

// {
//   NOTHING: 0,
//   ERROR: 1,
//   WARN: 2,
//   INFO: 3,
//   DEBUG: 4
// }
```

### `sleep` function

Sleeps for X **milliseconds** (default `1000`).

```ts
import { sleep } from 'dockest';

const program = async () => {
  await sleep(1337);
};

program();
```

### `sleepWithLog` function

Sleeps for X **seconds** (default `30`), printing the progress each second.

```ts
import { sleepWithLog } from 'dockest';

const program = async () => {
  await sleepWithLog(13, 'sleeping is cool');
};

program();
```

### `execa` function

Dockest's internal wrapper of the [`execa`](https://github.com/sindresorhus/execa) library. It runs the command in a
shell **synchronously** and returns execa's sync result (`stdout`, `stderr`, `exitCode`, ...). It throws when the
command fails, unless `execaOpts.reject` is `false`.

```ts
import { execa } from 'dockest';

const { stdout } = execa(`echo "hello :wave:"`, { logStdout: true });
```

`opts` structure:

| property  | description                                                                                 | type      | default     |
| --------- | ------------------------------------------------------------------------------------------- | --------- | ----------- |
| logPrefix | Prefixes logs                                                                               | `string`  | `'[Shell]'` |
| logStdout | Logs `stdout` from the child process (at debug level)                                       | `boolean` | `false`     |
| execaOpts | [Options](https://github.com/sindresorhus/execa/tree/v5.1.1#options) passed to `execa.sync` | `object`  | `{}`        |
| runner    | The `runner` from a readiness check; logs go through its logger                             | `Runner`  | -           |

# Compose file

- The `version:` key is obsolete in the Compose Specification and not needed.
- Ports can use the [short or long syntax](https://docs.docker.com/reference/compose-file/services/#ports)
  (`- '6379:6379'` or `published`/`target`); Compose normalizes both.
- A port without a host side (`- '6379'`) gets a random host port from Docker. It is accepted, but Dockest skips its
  connectivity check and `dockest/test-helper` can't resolve it, except in docker-in-docker mode, where services are
  reached by service name and container port.
- Several Compose files can be passed as an array to [`composeFile`](#dockestoptscomposefile).

# Running Dockest inside a container

Dockest detects where it runs:

- **On the host**: services are reached on `localhost` through their published ports.
- **Inside a container with its own Docker daemon** (see the
  [`docker-in-docker`](https://github.com/erikengervall/dockest/tree/master/packages/examples/docker-in-docker)
  example): same as on the host.
- **Docker-in-docker mode**, i.e. inside a container with the host's Docker socket mounted (e.g.
  `-v /var/run/docker.sock:/var/run/docker.sock`): Dockest joins its container and the services to a
  `dockest_bridge_network` network, services are reached by service name and container port, and the test process is
  reachable as `host.dockest-runner.internal`.

# Versioned Documentation

- [Latest](https://github.com/erikengervall/dockest/blob/master/README.md)
- [3.1.0](https://github.com/erikengervall/dockest/blob/v3.1.0/README.md)
- [2.0.0](https://github.com/erikengervall/dockest/tree/94bac6f7d11588909fb42d8ce3ebbb3eccc3c49c/website/versioned_docs/version-2.0.0)
- [1.0.4](https://github.com/erikengervall/dockest/tree/94bac6f7d11588909fb42d8ce3ebbb3eccc3c49c/website/versioned_docs/version-1.0.4)

# Contributing / development

This is a monorepo using [lerna](https://github.com/lerna/lerna), so every script runs from the root.

| script               | what it does                                                                          |
| -------------------- | ------------------------------------------------------------------------------------- |
| `yarn prep`          | Installs dependencies for all packages (root included) and builds what needs building |
| `yarn lint`          | Lints every package                                                                   |
| `yarn test:unit`     | Runs Dockest's unit tests                                                             |
| `yarn test:examples` | Runs the example integration tests (requires Docker)                                  |
| `yarn dev:link`      | Links the library source into each example                                            |

## Publishing a new version

1. Add the changes for the upcoming version to [`CHANGELOG.md`](CHANGELOG.md) and get them onto the branch you release
   from.
2. Bump the version from the project root: `yarn lerna version <VERSION>`, e.g. `yarn lerna version 3.2.0`. Lerna bumps
   every package, commits, creates the tag `v<VERSION>` and pushes the commit and the tag (if you passed `--no-push`,
   push them with `git push --follow-tags`).
3. CI runs lint, unit and integration tests on the tag and publishes the version to npm through
   [trusted publishing](https://docs.npmjs.com/trusted-publishers), so no npm token is involved and every version
   carries a provenance attestation. The tag must match the version in `packages/dockest/package.json`. A prerelease tag
   publishes under its identifier instead of `latest`, e.g. `v3.2.0-rc.1` publishes under the `rc` dist-tag.
4. If you released from a release branch, merge it into `master`.

Every push to `master` also publishes a `next` build (`npm install dockest@next`).

# Acknowledgements

Thanks to [Juan Lulkin](https://github.com/joaomilho) for the logo ❤️

Thanks to [Laurin Quast](https://github.com/n1ru4l) for great ideas and contributions 💙

# License

MIT
