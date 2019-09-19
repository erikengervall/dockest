export const complicated = {
  version: '3',
  services: {
    kafka: {
      environment: {
        KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181',
        KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092',
        KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT',
        KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true',
        KAFKA_BROKER_ID: 1,
        KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1,
      },
      // eslint-disable-next-line @typescript-eslint/camelcase
      depends_on: ['zookeeper'],
      image: 'kafka/image:123',
      ports: ['9092:9092'],
    },
    zookeeper: {
      environment: {
        ZOOKEEPER_CLIENT_PORT: '2181',
      },
      image: 'zookeeper/image:123',
      ports: ['2181:2181'],
    },
    postgres: {
      environment: {
        POSTGRES_DB: '_',
        POSTGRES_PASSWORD: '_',
        POSTGRES_USER: '_',
      },
      image: 'postgres/image:123',
      ports: ['5432:5432'],
    },
    redis: {
      image: 'redis/image:123',
      ports: ['6379:6379'],
    },
    general: {
      image: 'general/image:123',
      ports: [],
    },
  },
}

export const singlePostgres = {
  version: '3',
  services: {
    postgres: {
      environment: {
        POSTGRES_DB: '_',
        POSTGRES_PASSWORD: '_',
        POSTGRES_USER: '_',
      },
      image: 'postgres/image:123',
      ports: ['5432:5432'],
    },
  },
}

export const singleRedis = {
  version: '3',
  services: {
    redis: {
      image: 'redis/image:123',
      ports: ['6379:6379'],
    },
  },
}

export const postgresAndRedis = {
  version: '3',
  services: {
    ...singlePostgres.services,
    ...singleRedis.services,
  },
}
