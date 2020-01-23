---
id: api_reference
title: API Reference
sidebar_label: API Reference
---

```ts
import { Dockest } from 'dockest'

const { run } = new Dockest({ opts })
```

## opts [object]

`opts` is optional, i.e. the dockest constructor can be called without arguments.

### `afterSetupSleep` [number]

Default: `0`

Additional sleep after initial setup. Useful when services require additional time to boot and there's no applicable healthcheck

### `composeFile` [string]

Default: `'docker-compose.yml'`

Compose file(s) with services to use while running tests

### `composeOpts` [object]

Default:

```ts
{
  alwaysRecreateDeps: false,
  build: false,
  forceRecreate: false,
  noBuild: false,
  noColor: false,
  noDeps: false,
  noRecreate: false,
  quietPull: false,
}
```

Forwards options to `docker-compose up`, [Docker's docs](https://docs.docker.com/compose/reference/up/).

### `composeOpts.alwaysRecreateDeps` [boolean]

Default: `false`

Recreate dependent containers. Incompatible with --no-recreate

### `composeOpts.build` [boolean]

Default: `false`

Build images before starting containers

### `composeOpts.forceRecreate` [boolean]

Default: `false`

Recreate containers even if their configuration and image haven't changed

### `composeOpts.noBuild` [boolean]

Default: `false`

Don't build an image, even if it's missing

### `composeOpts.noColor` [boolean]

Default: `false`

Produce monochrome output

### `composeOpts.noDeps` [boolean]

Default: `false`

Don't start linked services

### `composeOpts.noRecreate` [boolean]

Default: `false`

If containers already exist, don't recreate them. Incompatible with --force-recreate and -V

### `composeOpts.quietPull` [boolean]

Default: `false`

Pull without printing progress information

### `debug` [boolean]

Default: `false`

Pauses Dockest just before executing Jest. Useful for more rapid development using Jest manually

### `dumpErrors` [boolean]

Default: `false`

Serializes errors and dumps them in `dockest-error.json`. Useful for debugging.

### `exitHandler` [function]

Default: `null`

Callback that will run before exit. Received one argument of type { type: string, code?: number, signal?: any, error?: Error, reason?: any, p?: any }

### `jestLib` [object]

Default: `require`('jest')

    The Jest library itself, typically passed as { lib: require('jest') }. If omitted, Dockest will attempt to require Jest from your application's dependencies. If absent, Dockest will use it's own version.

### `jestOpts` [object]

Default: `{}`

    Jest's CLI options, an exhaustive list of CLI-options can be found in [Jest's](https://jestjs.io/docs/en/cli.html) documentation

### `logLevel` [object]

Default: `logLevel`.NORMAL

    Decides how much logging will occur. Each level represents a number ranging from 0-4

### `runInBand` [boolean]

Default: `true`

Initializes and runs the Runners in sequence. Disabling this could increase performance

_Note: Jest runs tests in parallel per default, which is why Dockest defaults `runInBand` to `true`. This will cause jest to run sequentially in order to avoid race conditions for I/O operations. This may lead to longer runtimes._

## `run` [function]

<!-- TODO: Move this to a seperate page -->

```ts
import { Dockest } from 'dockest'

const { run } = new Dockest()

const dockestServices = [
  {
    serviceName: 'service1',
    commands: ['echo "Hello name1 🌊"'],
    dependents: [
      {
        serviceName: 'service2',
      },
    ],
    healthcheck: () => Promise.resolve(), // TODO: Update docs
  },
]

run(dockestServices)
```

## dockestService

Dockest services are meant to map to services declared in the Compose file(s)

### `dockestService.name` [string]

**Required**

Default: `-`

Service name that matches the corresponding service in your Compose file

### `dockestService.commands` [string[]]

Default: `[]`

Bash scripts that will run once the service is ready. E.g. database migrations.

### `dockestService.dependents` [DockestService[]]

Default: `[]`

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
]
```

will ensure that `service1` starts up and is fully responsive before even attempting to start `service2`.

> Why not rely on the Docker File service configuration options `depends_on`?

[Docker's docs](https://docs.docker.com/compose/compose-file/#depends_on) explains this very neatly:

```yaml
version: '3.7'
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

> `depends_on` does not wait for `db` and `redis` to be “ready” before starting `web` - only until they have been started.

### `dockestService.healthcheck` [function]

Default: `() => Promise.resolve()`

The Dockest Service's healthcheck function is there to determine the service's health (or responsiveness) by e.g.,
E.g. responsiveness checking a database using `select 1`. The healthcheck function receive the corresponding Compose service configuration from the Compose file as first argument and the containerId as the second.

The healthcheck takes a single argument in form of an object.

```ts
const dockestServices = [
  {
    serviceName: 'service1',
    healthcheck: ({
      containerId,
      defaultHealthchecks: { postgres, redis, web },
      dockerComposeFileService: { ports },
      logger,
    }) => {
      // ...
    },
  },
]
```

#### containerId

The Docker [container's id](https://docs.docker.com/engine/reference/run/#container-identification).

#### defaultHealthchecks

Dockest exposes a few default healthchecks that developers can use. These are plug-and-play async functions that will attempt to establish responsiveness towards a service.

#### dockerComposeFileService

This is an object representation of your service's information from the Compose file.

#### logger

An instance, specific to this particular Dockest Service (internally known as Runner), of the internal Dockest logger. Using this logger will prettify and contextualize logs with e.g. the serviceName.
