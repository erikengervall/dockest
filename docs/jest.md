---
id: jest
title: Jest
sidebar_label: Jest
---

## Interface

| Prop      | Required | Type     | Default         | Description                                                                                                                                                   |
| --------- | -------- | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lib       | false    | object   | require('jest') | The Jest library itself, typically passed as { lib: require('jest') }. If ommitted, Dockest will attempt to require Jest from your application's dependencies |
| projects  | false    | string[] | ['.']           | https://jestjs.io/docs/en/cli.html#projects-path1-pathn-                                                                                                      |
| runInBand | false    | boolean  | true            | https://jestjs.io/docs/en/cli.html#runinband                                                                                                                  |

Note that due to Jest running all tests in parallel per default, Dockest defaults the `runInBand` option to `true`. This'll cause jest to run its tests sequentially and thus avoid potential race conditions if tests perform read/write operations on the same entry. The downside of this is an overall longer runtime.

A complete list of CLI-options can be found in [Jest's](https://jestjs.io/docs/en/cli.html) documentation.

### Opts

It's possible to pass custom configuration to Dockest in order to improve developer experience.

## Interface

| Prop            | Required | Type               | Default             | Description                                                                                                                                           |
| --------------- | -------- | ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| afterSetupSleep | false    | number             | 0                   | Additional sleep after initial setup. Useful when resources require additional time to boot                                                           |
| dev             | false    | { debug: boolean } | { debug: false }    | Pauses Jest execution indefinitely. Useful for debugging Jest while resources are running                                                             |
| composeFileName | false    | string             | docker-compose.yml  | The name of your Compose file. This is required if you do **not** pass the image property for each Runner                                             |
| exitHandler     | false    | function           | null                | Callback that will run before exit. Recieved one argument of type { type: string, code?: number, signal?: any, error?: Error, reason?: any, p?: any } |
| logLevel        | false    | number             | 2 (logLevel.NORMAL) | Sets the log level between 0 and 4                                                                                                                    |
| runInBand       | false    | boolean            | true                | Initializes and runs the Runners in sequence. Disabling this could increase performance                                                               |
