---
id: runner-shared-props
title: Shared runner props
sidebar_label: Shared runner props
---

These props are available for all Runners

| Prop                  | Required | Type                                    | Default           | Description                                                                                                                                                                                              |
| --------------------- | -------- | --------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| service               | true     | string                                  | -                 | Used as an identifier of the container in the stack                                                                                                                                                      |
| build                 | false    | string                                  | undefined         | [Build time options](https://docs.docker.com/compose/compose-file/#build) for Docker Compose. Currently supports directory paths.                                                                        |
| commands              | false    | string[]                                | []                | Custom commands that execute _once_ after service responsiveness has been established                                                                                                                    |
| connectionTimeout     | false    | number                                  | 30                | How long to wait for the resource to be reachable                                                                                                                                                        |
| dependsOn             | false    | Runner[]                                | []                | Defines the service's [dependencies](https://docs.docker.com/compose/compose-file/#depends_on)                                                                                                           |
| host                  | false    | string                                  | 'localhost'       | Hostname                                                                                                                                                                                                 |
| image                 | false    | string &#124; undefined                 | undefined         | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from                                                                                                     |
| networks              | false    | string[]                                | []                | Networks used for determining which containers can communicate between each other through the service name as a host ([Learn more](https://docs.docker.com/compose/networking/#specify-custom-networks)) |
| ports                 | false    | { published: number, target: number }[] | Depends on Runner | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#long-syntax-1)                                                                                                               |
| props                 | false    | { [key: string]: any }                  | {}                | Arbitrary props that'll be passed to the Compose service                                                                                                                                                 |
| responsivenessTimeout | false    | number                                  | 10                | How long to wait for the resource to be reachable                                                                                                                                                        |
