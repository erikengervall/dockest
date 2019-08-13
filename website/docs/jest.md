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

Note that due to Jest running all tests in parallel per default, Dockest defaults the `runInBand` option to `true`. This will cause jest to run its tests sequentially and thus avoid potential race conditions if tests perform read/write operations on the same entry. The downside of this is an overall longer runtime.

A complete list of CLI-options can be found in [Jest's](https://jestjs.io/docs/en/cli.html) documentation.
