---
id: runner-general-purpose-runner
title: General Purpose Runner
sidebar_label: General Purpose Runner
---

## Minimal working example

```ts
import { runners } from 'dockest'

const opts = {
  service: 'insert-service-here',
  image: 'your-application-image',
  dependsOn: [postgresRunner],
  ports: [{ published: 3000, target: 3000 }],
  networks: ['database_network'],
}

const appRunner = new runners.GeneralPurposeRunner(opts)
```

## Unique props

This interface is an extension of the [shared props](runner-sharedprops).

| Prop                          | Required | Type                            | Default | Description                                                    |
| ----------------------------- | -------- | ------------------------------- | ------- | -------------------------------------------------------------- |
| getResponsivenessCheckCommand | null     | (containerId: string) => string | null    | Declare a function that returns a responsiveness check command |

## Declaring a Responsiveness Check Command

The responsiveness healthcheck is used for determining when a container is ready. E.g. when the HTTP server has started.

A responsiveness check can be declared via the `getResponsivenessCheckCommand` option.

```ts
const getResponsivenessCheckCommand = (containerId: string) => {
  return ` \
    docker exec ${containerId} \
    sh -c "wget --quiet --tries=1 --spider http://localhost:3000/.well-known/healthcheck" \
  `
}

const appRunner = new runners.GeneralPurposeRunner({
  ...opts,
  getResponsivenessCheckCommand,
})
```
