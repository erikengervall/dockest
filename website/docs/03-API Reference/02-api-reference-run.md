---
id: api-reference-run
title: Run
sidebar_label: Run
---

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

# DockestService

Dockest services are meant to map to services declared in the Compose file(s)

`DockestService` structure:

| property                                        | type                                                | default                   |
| ----------------------------------------------- | --------------------------------------------------- | ------------------------- |
| **[name](#dockestservicename)**                 | `string`                                            | property is required      |
| [commands](#dockestservicecommands)             | <code>(string &#124; function)[] => string[]</code> | `[]`                      |
| [dependents](#dockestservicedependents)         | `DockestService[]`                                  | `[]`                      |
| [readinessCheck](#dockestservicereadinesscheck) | `function`                                          | `() => Promise.resolve()` |

## `DockestService.name`

Service name that matches the corresponding service in your Compose file

## `DockestService.commands`

Bash scripts that will run once the service is ready. E.g. database migrations.

Can either be a string, or a function that generates a string. The function is fed the container id of the service.

## `DockestService.dependents`

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

## `DockestService.readinessCheck`

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

### `defaultReadinessChecks`

### `defaultReadinessChecks.postgres`

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

### `defaultReadinessChecks.redis`

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

### `defaultReadinessChecks.web` [WIP]

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
