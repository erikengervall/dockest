---
id: version-3.0.0-api_reference_run
title: Run
sidebar_label: Run
original_id: api_reference_run
---

```ts
import { Dockest } from 'dockest'

const { run } = new Dockest()

const dockestServices = [
  {
    serviceName: 'service1',
    commands: ['echo "Hello name1 🌊"'],
    dependsOn: [
      {
        serviceName: 'service2',
      },
    ],
    readinessCheck: () => Promise.resolve(),
  },
]

run(dockestServices)
```

# DockestService

Dockest services are meant to map to services declared in the Compose file(s)

`DockestService` structure:

| property                                        | type                                               | default                   |
| ----------------------------------------------- | -------------------------------------------------- | ------------------------- |
| **[name](#dockestservicename)**                 | `string`                                           | property is required      |
| [commands](#dockestservicecommands)             | <code>(string &#124; function)[] => string[]<code> | `[]`                      |
| [dependsOn](#dockestservicedependson)           | `DockestService[]`                                 | `[]`                      |
| [readinessCheck](#dockestservicereadinesscheck) | `function`                                         | `() => Promise.resolve()` |

## `DockestService.name`

Service name that matches the corresponding service in your Compose file

## `DockestService.commands`

Bash scripts that will run once the service is ready. E.g. database migrations.

Can either be a string, or a function that generates a string. The function is fed the container id of the service.

## `DockestService.dependsOn`

With the `dependsOn` options you specify other services this service relies on.

For example, the following code

```ts
const dockestServices = [
  {
    serviceName: 'service1',
    dependsOn: [
      {
        serviceName: 'service2',
      },
    ],
  },
]
```

will ensure that `service2` starts up and is fully responsive before even attempting to start `service1`.

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
example, querying a database using `select 1`. Learn more about the predefined readiness checks in the
[Readiness Check API reference](version-3.0.0-api_reference_readiness_check)

Here are some examples of basic readinessChecks:

**Wait for 5 seconds before resolving the readiness check.**

```ts
const dockestServices = [
  {
    serviceName: 'service1',
    readinessCheck: ({ runner }) => new Promise(resolve => setTimeout(resolve, 5000)),
  },
]
```

**Execute command in container until it succeeds**

```ts
import { execa } from 'dockest'
import { withRetry } from 'dockest/readiness-check'

const retryCount = 10

const dockestServices = [
  {
    serviceName: 'postgres',
    readinessCheck: withRetry(async ({ runner }) => {
      // throws if postgres service is not yet responsive
      await execa(`docker exec ${args.runner.containerId} bash -c "psql  -c 'select 1'"`)
    }, retryCount),
  },
]
```
