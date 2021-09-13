---
id: api_reference_utils
title: Utils
sidebar_label: Utils
original_id: api_reference_utils
---

## `logLevel` object

Helper constant for DockestOpts

```ts
import { logLevel } from 'dockest'

console.log(logLevel)

// {
//   NOTHING: 0,
//   ERROR: 1,
//   WARN: 2,
//   INFO: 3,
//   DEBUG: 4
// }
```

## `sleep` function

Sleeps for X **milliseconds**.

```ts
import { sleep } from 'dockest'

const program = async () => {
  await sleep(1337)
}

program()
```

## `sleepWithLog` function

Sleeps for X **seconds**, printing a message each second with the progress.

```ts
import { sleepWithLog } from 'dockest'

const program = async () => {
  await sleepWithLog(13, 'sleeping is cool')
}

program()
```

## `execa` function

Exposes the internal wrapper of the `execa` library.

```ts
import { execa } from 'dockest'

const opts = {
  logPrefix,
  logStdout,
  execaOpts,
  runner,
}

const program = async () => {
  await execa(`echo "hello :wave:"`, opts)
}

program()
```

`opts` structure:

| property  | description                                                                                                                                 | type      | default     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| logPrefix | Prefixes logs                                                                                                                               | `string`  | `'[Shell]'` |
| logStdout | Prints `stdout` from the child process                                                                                                      | `boolean` | `false`     |
| execaOpts | [Options](https://github.com/sindresorhus/execa/blob/df08cfb2d849adb31dc764ca3ab5f29e5b191d50/index.d.ts#L230) passed to the execa function | `object`  | `{}`        |
| runner    | Internal representation of a DockestService. Ignore this                                                                                    | `Runner`  | -           |
