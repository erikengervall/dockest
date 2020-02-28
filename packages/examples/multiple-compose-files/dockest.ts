import { Dockest, logLevel } from 'dockest'

const dockest = new Dockest({
  composeFile: ['docker-compose-redis.yml', 'docker-compose-postgres.yml'],
  dumpErrors: true,
  jestLib: require('jest'),
  logLevel: logLevel.DEBUG,
})

dockest.run([
  {
    serviceName: 'multiple_compose_files_postgres',
    commands: [
      'sequelize db:migrate:undo:all',
      'sequelize db:migrate',
      'sequelize db:seed:undo:all',
      'sequelize db:seed --seed 20190101001337-demo-user',
    ],
    readinessCheck: async ({
      defaultReadinessChecks: { postgres },
      dockerComposeFileService: {
        environment: { POSTGRES_DB, POSTGRES_USER },
      },
    }) =>
      Promise.all([
        (new Promise(resolve => {
          setTimeout(resolve, 50)
          // eslint-disable-next-line no-console
          console.log('Arbitrary ReadinessCheck step')
        }),
        postgres({ POSTGRES_DB, POSTGRES_USER })),
      ]),
  },

  {
    serviceName: 'multiple_compose_files_redis',
  },
])
