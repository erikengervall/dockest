---
id: version-3.0.0-api_reference_readiness_check
title: ReadinessCheck
sidebar_label: ReadinessCheck
original_id: api_reference_readiness_check
---

A `ReadinessCheck` is a function that is used for determining whether a container/service is responsive and the dockest
stack is ready for test execution.

The `ReadinessCheck` receives the service runner object as a argument and should return either a `Promise` or RXJS
`Observable`. In addition dockest comes with a set of helper utilities and predefined readiness checks for common
scenarios. All those helpers/utilities are exported under `dockest/readiness-check`.

```ts
interface ReadinessCheck {
  (args: { runner: Runner }): Promise<any> | Observable<any>
}

interface Runner {
  commands: Commands
  containerId: ContainerId
  dependents: Runner[]
  dockerComposeFileService: DockerComposeFileService
  dockerEventStream$: DockerServiceEventStream
  logger: Logger
  readinessCheck: ReadinessCheck
  serviceName: ServiceName
  host?: string
  isBridgeNetworkMode?: boolean
}
```

### `containerIsHealthyReadinessCheck`

This is a readiness check that will succeed once the container successfully emitted the `heathy` event. The prerequisite
for this is that the container `Dockerfile` has a
[`HEALTHCHECK`](https://docs.docker.com/engine/reference/builder/#healthcheck) instruction. This readiness check will
automatically fail if the container dies or gets killed before the container becomes healthy.

**Usage example:**

```ts
import { Dockest } from 'dockest'
import { containerIsHealthyReadinessCheck } from 'dockest/readiness-check'

const dockest = new Dockest()

dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: containerIsHealthyReadinessCheck,
  },
])
```

## `zeroExitCodeReadinessCheck`

This is a readiness check that will succeed once the container successfully emitted the die event with an `exitCode` of
`"0"`. The readinessCheck will fail if the container exits with any other exit code. This readiness check is handy for
use-cases where a container might setup stuff, like running some kind of database migration.

**Usage example:**

```ts
import { Dockest } from 'dockest'
import { zeroExitCodeReadinessCheck } from 'dockest/readiness-check'

const dockest = new Dockest()

dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: zeroExitCodeReadinessCheck,
  },
])
```

## `createPostgresReadinessCheck`

This readiness check is handy for containers that use the
[Official postgres docker image](https://hub.docker.com/_/postgres) as a base.

**Usage example:**

```yml
version: '3.8'

services:
  my-service:
    image: postgres:9.6-alpine
    ports:
      - published: 5433
        target: 5432
    environment:
      POSTGRES_DB: what
      POSTGRES_USER: is
      POSTGRES_PASSWORD: love
```

```ts
import { Dockest } from 'dockest'
import { createPostgresReadinessCheck } from 'dockest/readiness-check'

const dockest = new Dockest()

dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: createPostgresReadinessCheck(),
  },
])
```

It will automatically use the `environment` variables from the service definition for executing a `SELECT 1;` query
within the postgres container until it succeeds with a default retry count of 30.

The retry count can be customized.

```ts
dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: createPostgresReadinessCheck({ retryCount: 5 }),
  },
])
```

Additionally a custom config for the postgres environment can be provided.

```ts
dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: createPostgresReadinessCheck({
      config: {
        POSTGRES_DB: 'what',
        POSTGRES_USER: 'is',
      },
    }),
  },
])
```

## `createRedisReadinessCheck`

This readiness check is handy for containers that use the [Official redis docker image](https://hub.docker.com/_/redis)
as a base.

```yml
version: '3.8'

services:
  my-service:
    image: redis:5.0.3-alpine
    ports:
      - published: 6380
        target: 6379
```

```ts
import { Dockest } from 'dockest'
import { createRedisReadinessCheck } from 'dockest/readiness-check'

const dockest = new Dockest()

dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: createRedisReadinessCheck(),
  },
])
```

It will automatically use the port mappings for executing a `redis-cli PING` command until it succeeds within the
container with a default retry count of 30.

The retry count can be customized.

```ts
dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: createRedisReadinessCheck({ retryCount: 5 }),
  },
])
```

Additionally a custom port config can be provided.

```ts
dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: createRedisReadinessCheck({ port: 5 }),
  },
])
```

## `createWebReadinessCheck`

This readiness check is handy for containers that expose a HTTP service. A prerequisite of this readiness check is that
the `wget` cli tool is also installed within the container. The command will execute a `wget` command within the
container with `localhost:3000/.well-known/healthcheck` as the target until it succeeds with a default retry count
of 30.

```ts
import { Dockest } from 'dockest'
import { createWebReadinessCheck } from 'dockest/readiness-check'

const dockest = new Dockest()

dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: createWebReadinessCheck(),
  },
])
```

The retry count can be customized.

```ts
dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: createWebReadinessCheck({ retryCount: 5 }),
  },
])
```

The target port can be customized.

```ts
import { Dockest } from 'dockest'
import { createWebReadinessCheck } from 'dockest/readiness-check'

const dockest = new Dockest()

dockest.run([
  {
    serviceName: 'my-service',
    readinessCheck: createWebReadinessCheck({ port: 8080 }),
  },
])
```

## `withRetry`

This utility can be used to compose a `ReadinessCheck` into a new `ReadinessCheck` that retries the wrapped
`ReadinessCheck`.

Under the hood this utility is already used by `createPostgresReadinessCheck`, `createRedisReadinessCheck` and
`createWebReadinessCheck`.

```ts
import { withRetry } from 'dockest/readiness-check'

const readinessCheck = async ({ runner }) => {
  // run the check here
}

// create a readiness check that is retried 5 times before failing
const readinessCheckWithRetry = withRetry(readinessCheck, {
  retryCount: 5,
})
```

## `withNoStop`

This utility can be used to compose a `ReadinessCheck` into a new `ReadinessCheck` that automatically fails if the
underlying service/container stops. This is handy when your readiness check should immediately fail when the container
dies.

Under the hood this utility is used by `containerIsHealthyReadinessCheck`, `createPostgresReadinessCheck`,
`createRedisReadinessCheck` and `createWebReadinessCheck`.

```ts
import { withNoStop } from 'dockest/readiness-check'

const readinessCheck = async ({ runner }) => {
  // run the check here
}

const readinessCheckWithRetry = withNoStop(readinessCheck)
```
