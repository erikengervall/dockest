---
id: api_reference_dockest_opts
title: DockestOpts
sidebar_label: DockestOpts
original_id: api_reference_dockest_opts
---

```ts
import { Dockest } from 'dockest'

const { run } = new Dockest(opts)
```

## DockestOpts

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

### `DockestOpts.composeFile`

Compose file(s) with services to use while running tests

### `DockestOpts.composeOpts`

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

### `DockestOpts.debug`

Pauses Dockest just before executing Jest. Useful for more rapid development using Jest manually

### `DockestOpts.dumpErrors`

Serializes errors and dumps them in `dockest-error.json`. Useful for debugging.

### `DockestOpts.exitHandler`

Callback that will run before exit. Received one argument of type { type: string, code?: number, signal?: any, error?:
Error, reason?: any, p?: any }

### `DockestOpts.jestLib`

The Jest library itself, typically passed as `{ lib: require('jest') }`. If omitted, Dockest will attempt to require
Jest from your application's dependencies. If absent, Dockest will use it's own version.

### `DockestOpts.jestOpts`

Jest's CLI options, an exhaustive list of CLI-options can be found in [Jest's](https://jestjs.io/docs/en/cli.html)
documentation

### `DockestOpts.logLevel`

Decides how much logging will occur. Each level represents a number ranging from 0-4

### `DockestOpts.runInBand` [boolean]

Initializes and runs the Runners in sequence. Disabling this could increase performance

_Note: Jest runs tests in parallel per default, which is why Dockest defaults `runInBand` to `true`. This will cause
jest to run sequentially in order to avoid race conditions for I/O operations. This may lead to longer runtimes._
