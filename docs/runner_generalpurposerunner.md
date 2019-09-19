---
id: runner_generalpurposerunner
title: GeneralPurposeRunner
sidebar_label: GeneralPurposeRunner
---

## Minimal working example

```TypeScript
import { runners } from "dockest"

const opts = {
  service: 'service-name',
  image: "your-application-image",
  dependsOn: [
    postgresRunner
  ],
  ports: { '3000': '3000' },
  networks: ["database_network"],
  getResponsivenessCheckCommand: containerId => {
    return ` \
      docker exec ${containerId} \
      sh -c "wget --quiet --tries=1 --spider http://localhost:3000/.well-known/healthcheck" \
    `;
  }
}

const appRunner = new runners.GeneralPurposeRunner(opts)
```

## Interface

| Prop                          | Required | Type                            | Default            | Description                                                                                                                                                                                              |
| ----------------------------- | -------- | ------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| service                       | true     | string                          | -                  | Used as an identifier of the container in the stack                                                                                                                                                      |
| dependsOn                     | true     | Runner[]                        | []                 | Defines the service's [dependencies](https://docs.docker.com/compose/compose-file/#depends_on)                                                                                                           |
| commands                      | false    | string[]                        | []                 | Custom commands that execute _once_ after service responsiveness has been established                                                                                                                    |
| connectionTimeout             | false    | number                          | 30                 | How long to wait for the resource to be reachable                                                                                                                                                        |
| image                         | false    | string                          | undefined          | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from                                                                                                     |
| ports                         | false    | { [key: string]: string }       | { '9092': '9092' } | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#short-syntax-1)                                                                                                              |
| networks                      | false    | string[]                        | []                 | Networks used for determining which containers can communicate between each other through the service name as a host ([Learn more](https://docs.docker.com/compose/networking/#specify-custom-networks)) |
| getResponsivenessCheckCommand | null     | (containerId: string) => string | null               | Declare a function that returns a responsiveness check command                                                                                                                                           |

## Declaring a Responsiveness Check Command

The responsiveness healthcheck is used for determining when a container is ready. E.g. when the HTTP server has started.

A responsiveness check cn be declared via the `getResponsivenessCheckCommand` option.

```TypeScript
const getResponsivenessCheckCommand = (containerId: string) => {
  return ` \
    docker exec ${containerId} \
    sh -c "wget --quiet --tries=1 --spider http://localhost:3000/.well-known/healthcheck" \
  `;
}

const appRunner = new runners.GeneralPurposeRunner({
  ...opts,
  getResponsivenessCheckCommand
})
```
