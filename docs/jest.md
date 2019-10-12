---
id: jest
title: Jest
sidebar_label: Jest
---

## Interface

| Prop      | Required | Type     | Default         | Description                                                                                                                                                  |
| --------- | -------- | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| lib       | false    | object   | require('jest') | The Jest library itself, typically passed as { lib: require('jest') }. If omitted, Dockest will attempt to require Jest from your application's dependencies |
| projects  | false    | string[] | ['.']           | https://jestjs.io/docs/en/cli.html#projects-path1-pathn-                                                                                                     |
| runInBand | false    | boolean  | true            | https://jestjs.io/docs/en/cli.html#runinband                                                                                                                 |

_Note: Jest runs tests in parallel per default, which is why Dockest defaults `runInBand` to `true`. This will cause jest to run sequentially in order to avoid race conditions for I/O operations. This may lead to longer runtimes._

A complete list of CLI-options can be found in [Jest's](https://jestjs.io/docs/en/cli.html) documentation.
