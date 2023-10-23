# Dockest

Dockest is an integration testing tool aimed at alleviating the process of evaluating unit tests whilst running
multi-container Docker applications.

<p align="center">
  <a href='https://erikengervall.github.io/dockest/'><img alt="dockest logo" width="300px" src="https://raw.githubusercontent.com/erikengervall/dockest/master/resources/img/logo.png"></a>
</p>

<br>
<br>

<p align="center">
  <img alt="licence" src="https://github.com/erikengervall/dockest/workflows/Node.js%20CI/badge.svg">

  <a href="https://www.npmjs.com/package/dockest">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/dockest">
  </a>

  <a href="https://github.com/erikengervall/dockest/blob/master/LICENSE">
    <img alt="licence" src="https://img.shields.io/npm/l/dockest">
  </a>

  <a href="https://app.netlify.com/sites/dockest/deploys">
    <img alt="licence" src="https://api.netlify.com/api/v1/badges/36a8e5f8-42bf-402a-93a3-ba05ff7462b6/deploy-status">
  </a>

  <a href="https://snyk.io/test/github/erikengervall/dockest">
    <img alt="snyk" src="https://snyk.io/test/github/erikengervall/dockest/badge.svg">
  </a>
<p>

# Table of contents

- [Table of contents](#table-of-contents)
- [Introduction](#introduction)
- [Basic usage](#basic-usage)
- [Development](#development)
- [Acknowledgements](#acknowledgements)
- [API Reference](#api-reference)

# Introduction

## Motivation

The original motivation for Dockest, along with real world examples, can be read in this
[blog article](https://engineering.klarna.com/node-js-integration-testing-with-ease-fab5f8d29163).

> Dockest was born out of frustration and with a vision to make developers’ lives slightly less miserable.

Dockest provides an abstraction for your Docker services’ lifecycles during integration testing, freeing developers from
convoluted and flaky shell scripts. Adopting Dockest is super easy regardless if you’ve got existing tests or not and
doesn’t necessarily require additional CI pipeline steps.

## Why Dockest

The value that Dockest provides over e.g. plain docker-compose is that it figures out the connectivity and
responsiveness status of each individual service (either synchronously or asynchronously) and once all services are
ready the tests run.

## Example use cases

Dockest can be used in a variety of use cases and situations, some of which can be found under
[`packages/examples`](https://github.com/erikengervall/dockest/tree/master/packages/examples).

### AWS CodeBuild

What is AWS CodeBuild?

> [AWS CodeBuild is a fully managed continuous integration service that compiles source code, runs tests, and produces software packages that are ready to deploy.](https://aws.amazon.com/codebuild)

Cool, can I run it locally?

> [You can now locally test and debug your AWS CodeBuild builds using the new CodeBuild local agent.](https://hub.docker.com/r/amazon/aws-codebuild-local)

### Node.js to Node.js

Dockest can also build and run application services as part of your integration tests.

# Basic Usage

## System requirements

In order to run Dockest, there's a few system requirements:

- Dockest uses Jest's programmatic CLI and requires Jest **v20.0.0** or newer to work
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/) (_"On desktop systems like Docker Desktop for Mac and
  Windows, Docker Compose is included as part of those desktop installs."_)

## Install

```bash
yarn add --dev dockest
# npm install --save-dev dockest
```

## Application code

```ts
// cache.ts
export const cacheKey = 'arbitraryNumberKey';

export const setCache = (redisClient: Redis, arbitraryNumber: number) => {
  redisClient.set(cacheKey, arbitraryNumber);
};
```

### Unit tests

```ts
// cache.spec.ts
import Redis from 'ioredis'; // ... or client of choice
import { cacheKey, setCache } from './cache';

const redisClient = new Redis({
  host: 'localhost',
  port: 6379, // Match with configuration in docker-compose.yml
});

it('should cache an arbitrary number', async () => {
  const arbitraryNumber = 5;

  await setCache(redisClient, arbitraryNumber);

  const cachedValue = await redisClient.get(cacheKey);
  expect(cachedValue).toEqual(arbitraryNumber);
});
```

### Dockest integration tests

Transform unit test into an integration test by creating a `docker-compose.yml` and `dockest.ts` file.

> **Important note for the Compose file**
>
> Dockest expects services' ports to be defined using
> [long format](https://docs.docker.com/compose/compose-file/#long-syntax-1) and works best with high versions of
> docker-compose (i.e. 3.7 or higher)

```yml
# docker-compose.yml
version: '3.8'

services:
  myRedis:
    image: redis:5.0.3-alpine
    ports:
      - published: 6379
        target: 6379
```

```ts
// dockest.ts
import { Dockest } from 'dockest';

const dockest = new Dockest();

// Specify the services from the Compose file that should be included in the integration test
const dockestServices = [
  {
    serviceName: 'myRedis', // Must match a service in the Compose file
  },
];

dockest.run(dockestServices);
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
    "ts-node": "..."
  }
}
```

### Run

Finally, run the tests:

```sh
yarn test
```

<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->

# Development

## Publishing a new version

<!-- - Run `yarn lerna version --no-push --no-git-tag-version` from root
  - Select the appropriate version upgrade from the CLI prompt
- Update `CHANGELOG.md` with the changes since last update
- Commit & push the code changes with a message like `Update version to v<VERSION>`
- Create new tag `git tag v<VERSION>` (examples: `v3.0.1`, `v3.0.0-beta.2`)
- Push the newly created tag `git push --tags`
  - This will trigger a npm publication and a website deployment -->

## Prep

- Decide on a version. Let's reference it as `<VERSION>`
  - e.g. `v1.0.0`, append `-alpha.0` or `-beta.0` to inform the CI to publish the package to npm as such (i.e. **not**
    as "latest")
- Create release branch `git checkout -b "release-v<VERSION>"`
- Make sure `CHANGELOG.md` contains the changes for the upcoming version

## Creating a new version

- Be in release branch
- Make sure all changes are pushed to remote
- Run `yarn lerna version <VERSION>` (e.g. `yarn lerna version v3.0.0-beta.0`) from project root, this will:
  - Bump all packages configured with Lerna
  - Create a git tag
  - Push changes and tags (`git push --tags` to include tags)

From here, the pipeline will publish the library's new version to npm and redeploy the website

## Clean up

- Merge release branch into master
- Delete release branch

## Contributing

**Setup and testing**

This is a monorepo using [lerna](https://github.com/lerna/lerna), meaning all scripts can be run from root.

`yarn prep` will executes the necessary scripts to install dependencies for all packages (including root) as well as
build whatever needs building.

`yarn dev:link` will link the library source to each example, making developing a smoother experience.

# API Reference

## DockestOpts

```ts
import { Dockest } from 'dockest';

const { run } = new Dockest(opts);
```

### DockestOpts

`DockestOpts` is optional, i.e. the dockest constructor can be called without arguments.

`DockestOpts` structure:

| property                               | type       | default                                                 |
| -------------------------------------- | ---------- | ------------------------------------------------------- |
| [composeFile](#dockestoptscomposefile) | `string`   | `docker-compose.yml`                                    |
| [composeOpts](#dockestoptscomposeopts) | `object`   | see paragraph on [composeOpts](#dockestoptscomposeopts) |
| [debug](#dockestoptsdebug)             | `boolean`  | `false`                                                 |
| [dumpErrors](#dockestoptsdumperrors)   | `boolean`  | `false`                                                 |
| [exitHandler](#dockestoptsexitHandler) | `function` | `null`                                                  |
| [jestLib](#dockestoptsjestLib)         | `object`   | `require('jest')`                                       |
| [jestOpts](#dockestoptsjestOpts)       | `object`   | `{}`                                                    |
| [logLevel](#dockestoptslogLevel)       | `object`   | `logLevel.INFO`, i.e. `3`                               |
| [runInBand](#dockestoptsrunInBand)     | `boolean`  | `true`                                                  |

#### `DockestOpts.composeFile`

Compose file(s) with services to use while running tests

#### `DockestOpts.composeOpts`

`composeOpts` structure:

| property           | desription                                                                                      | type      | default |
| ------------------ | ----------------------------------------------------------------------------------------------- | --------- | ------- |
| alwaysRecreateDeps | Recreate dependent containers. Incompatible with `--no-recreate`                                | `boolean` | false   |
| build              | Build images before starting containers                                                         | `boolean` | false   |
| forceRecreate      | Recreate containers even if their configuration and image haven't changed                       | `boolean` | false   |
| noBuild            | Don't build an image, even if it's missing                                                      | `boolean` | false   |
| noColor            | Produce monochrome output                                                                       | `boolean` | false   |
| noDeps             | Don't start linked services                                                                     | `boolean` | false   |
| noRecreate         | If containers already exist, don't recreate them. Incompatible with `--force-recreate` and `-V` | `boolean` | false   |
| quietPull          | Pull without printing progress information                                                      | `boolean` | false   |

Forwards options to `docker-compose up`, [Docker's docs](https://docs.docker.com/compose/reference/up/).

#### `DockestOpts.debug`

Pauses Dockest just before executing Jest. Useful for more rapid development using Jest manually

#### `DockestOpts.dumpErrors`

Serializes errors and dumps them in `dockest-error.json`. Useful for debugging.

#### `DockestOpts.exitHandler`

Callback that will run before exit. Received one argument of type { type: string, code?: number, signal?: any, error?:
Error, reason?: any, p?: any }

#### `DockestOpts.jestLib`

The Jest library itself, typically passed as `{ lib: require('jest') }`. If omitted, Dockest will attempt to require
Jest from your application's dependencies. If absent, Dockest will use it's own version.

#### `DockestOpts.jestOpts`

Jest's CLI options, an exhaustive list of CLI-options can be found in [Jest's](https://jestjs.io/docs/en/cli.html)
documentation

#### `DockestOpts.logLevel`

Decides how much logging will occur. Each level represents a number ranging from 0-4

#### `DockestOpts.runInBand` [boolean]

Initializes and runs the Runners in sequence. Disabling this could increase performance

_Note: Jest runs tests in parallel per default, which is why Dockest defaults `runInBand` to `true`. This will cause
jest to run sequentially in order to avoid race conditions for I/O operations. This may lead to longer runtimes._

## Run

```ts
import { Dockest } from 'dockest';

const { run } = new Dockest();

const dockestServices = [
  {
    serviceName: 'service1',
    commands: ['echo "Hello name1 🌊"'],
    dependents: [
      {
        serviceName: 'service2',
      },
    ],
    readinessCheck: () => Promise.resolve(),
  },
];

run(dockestServices);
```

## DockestService

Dockest services are meant to map to services declared in the Compose file(s)

`DockestService` structure:

| property                                        | type                                                | default                   |
| ----------------------------------------------- | --------------------------------------------------- | ------------------------- |
| **[name](#dockestservicename)**                 | `string`                                            | property is required      |
| [commands](#dockestservicecommands)             | <code>(string &#124; function)[] => string[]</code> | `[]`                      |
| [dependents](#dockestservicedependents)         | `DockestService[]`                                  | `[]`                      |
| [readinessCheck](#dockestservicereadinesscheck) | `function`                                          | `() => Promise.resolve()` |

### `DockestService.name`

Service name that matches the corresponding service in your Compose file

### `DockestService.commands`

Bash scripts that will run once the service is ready. E.g. database migrations.

Can either be a string, or a function that generates a string. The function is fed the container id of the service.

### `DockestService.dependents`

`dependents` are Dockest services that are are dependent on the parent service.

For example, the following code

```ts
const dockestServices = [
  {
    serviceName: 'service1',
    dependents: [
      {
        serviceName: 'service2',
      },
    ],
  },
];
```

will ensure that `service1` starts up and is fully responsive before even attempting to start `service2`.

> Why not rely on the Docker File service configuration options `depends_on`?

[Docker's docs](https://docs.docker.com/compose/compose-file/#depends_on) explains this very neatly:

```yaml
version: '3.8'
services:
  web:
    build: .
    depends_on:
      - db
      - redis
  redis:
    image: redis
  db:
    image: postgres
```

> `depends_on` does not wait for `db` and `redis` to be “ready” before starting `web` - only until they have been
> started.

### `DockestService.readinessCheck`

The Dockest Service's readinessCheck function helps determining a service's readiness (or "responsiveness") by, for
example, querying a database using `select 1`. The readinessCheck function receive the corresponding Compose service
configuration from the Compose file as first argument and the containerId as the second.

The readinessCheck takes a single argument in form of an object.

```ts
const dockestServices = [
  {
    serviceName: 'service1',
    readinessCheck: async ({
      containerId,
      defaultReadinessChecks: { postgres, redis, web },
      dockerComposeFileService: { ports },
      logger,
    }) => {
      // implement your readinessCheck...
    },
  },
];
```

`readinessCheck` structure:

| property                 | description                                                                                                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| containerId              | The Docker [container's id](https://docs.docker.com/engine/reference/run/#container-identification).                                                                                                     |
| defaultReadinessChecks   | Dockest exposes a few default readinessChecks that developers can use. These are plug-and-play async functions that will attempt to establish responsiveness towards a service.                          |
| dockerComposeFileService | This is an object representation of your service's information from the Compose file.                                                                                                                    |
| logger                   | An instance, specific to this particular Dockest Service (internally known as Runner), of the internal Dockest logger. Using this logger will prettify and contextualize logs with e.g. the serviceName. |

#### `defaultReadinessChecks`

#### `defaultReadinessChecks.postgres`

The default readiness check for PostgreSQL is based on this [image](https://hub.docker.com/_/postgres) which expects
certain environment variables.

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres: # (1)
    image: postgres:9.6-alpine
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

const { run } = new Dockest();

run([
  {
    serviceName: 'postgres', // must match (1)
    readinessCheck: async ({
      defaultReadinessChecks: { postgres },
      dockerComposeFileService: {
        environment: { POSTGRES_DB, POSTGRES_USER }, // must match (2)
      },
    }) => postgres({ POSTGRES_DB, POSTGRES_USER }),
  },
]);
```

#### `defaultReadinessChecks.redis`

The default readiness check for Redis is based on this [image](https://hub.docker.com/_/postgres) which is
plug-and-play.

```yaml
# docker-compose.yml
version: '3.8'

services:
  redis: # (1)
    image: redis:5.0.3-alpine
    ports:
      - published: 6379
        target: 6379
```

```ts
// dockest.ts
import { Dockest } from 'dockest';

const { run } = new Dockest();

run([
  {
    serviceName: 'redis', // must match (1)
    readinessCheck: ({ defaultReadinessChecks: { redis } }) => redis(),
  },
]);
```

#### `defaultReadinessChecks.web` [WIP]

Requires [wget](https://www.gnu.org/software/wget/). The image would most likely be a self-built web service.

The exact use case should be fleshed out.

```ts
// dockest.ts
import { Dockest } from 'dockest';

const { run } = new Dockest();

run([
  {
    serviceName: 'web', // must match (1)
    readinessCheck: async ({ defaultReadinessChecks: { web } }) => web(),
  },
]);
```

## Utils

### `logLevel` object

Helper constant for DockestOpts

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

Sleeps for X **milliseconds**.

```ts
import { sleep } from 'dockest';

const program = async () => {
  await sleep(1337);
};

program();
```

### `sleepWithLog` function

Sleeps for X **seconds**, printing a message each second with the progress.

```ts
import { sleepWithLog } from 'dockest';

const program = async () => {
  await sleepWithLog(13, 'sleeping is cool');
};

program();
```

### `execa` function

Exposes the internal wrapper of the `execa` library.

```ts
import { execa } from 'dockest';

const opts = {
  logPrefix,
  logStdout,
  execaOpts,
  runner,
};

const program = async () => {
  await execa(`echo "hello :wave:"`, opts);
};

program();
```

`opts` structure:

| property  | description                                                                                                                                 | type      | default     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| logPrefix | Prefixes logs                                                                                                                               | `string`  | `'[Shell]'` |
| logStdout | Prints `stdout` from the child process                                                                                                      | `boolean` | `false`     |
| execaOpts | [Options](https://github.com/sindresorhus/execa/blob/df08cfb2d849adb31dc764ca3ab5f29e5b191d50/index.d.ts#L230) passed to the execa function | `object`  | `{}`        |
| runner    | Internal representation of a DockestService. Ignore this                                                                                    | `Runner`  | -           |

# Versioned Documentation

- [Latest](https://github.com/erikengervall/dockest/blob/master/README.md)
- [2.0.0](https://github.com/erikengervall/dockest/tree/94bac6f7d11588909fb42d8ce3ebbb3eccc3c49c/website/versioned_docs/version-2.0.0)
- [1.4.0](https://github.com/erikengervall/dockest/tree/94bac6f7d11588909fb42d8ce3ebbb3eccc3c49c/website/versioned_docs/version-1.0.4)

# Acknowledgements

Thanks to [Juan Lulkin](https://github.com/joaomilho) for the logo ❤️

Thanks to [Laurin Quast](https://github.com/n1ru4l) for great ideas and contributions 💙

# License

MIT
