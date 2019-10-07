# Larger integration test example

Showcases how a runner can inherit the configuration from a compose-file based on its service name.

The `postgres-service` inherit the image and ports from the `docker-compose.yml` file.

# Exposed ports

- Postgres sequelize
  - 5435
- Postgres knex
  - 5436
- Redis
  - 6380
- ZooKeeper
  - 2181
- Kafka
  - 9092
  - 9093
  - 9094
