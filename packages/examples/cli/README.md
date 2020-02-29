# cli

Run Dockest via the CLI

Specify which services to run using `.dockest` file. Structure:

```
serviceName,serviceType
```

For example

```
my_redis_service,redis
```

This'll run the default healthchecks for that serviceType.

Available serviceTypes with default healthchecks:

- redis
- postgres
- web
