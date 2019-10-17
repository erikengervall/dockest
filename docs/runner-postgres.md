---
id: runner-postgres
title: Postgres
sidebar_label: Postgres
---

## Minimal working example

```ts
new PostgresRunner({
  service: 'insert-service-here', // Should match the Compose file's intended service
  database: 'insert-database-here',
  password: 'insert-password-here',
  username: 'insert-username-here',
})
```

## Interface

This interface is an extension of the [shared props](runner_sharedprops).

| Prop     | Required | Type                                    | Default                               | Description                                                                                |
| -------- | -------- | --------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| database | true     | string                                  | -                                     | Database's name                                                                            |
| password | true     | string                                  | -                                     | Database's password                                                                        |
| username | true     | string                                  | -                                     | Database's username                                                                        |
| ports    | false    | { published: number, target: number }[] | `[{ published: 5432, target: 5432 }]` | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#long-syntax-1) |

## Static members

| Static member | Type   | Value       |
| ------------- | ------ | ----------- |
| DEFAULT_HOST  | string | 'localhost' |
| DEFAULT_PORT  | string | 5432        |

## Healthchecks

1. Runs [connectivity](connectivity.md) check
2. Runs [responsiveness](responsiveness.md) check by querying the database with `select 1`
