import { Dockest, logLevel, sleepWithLog } from 'dockest'

const { run } = new Dockest({
  dumpErrors: true,
  logLevel: logLevel.DEBUG,
  composeFile: 'docker-compose.yml',
})

run([
  {
    serviceName: 'node_to_node_orders',
    commands: ['echo "Hello from orders (dependency - should run first) 👋🏽"'],
    dependents: [
      {
        serviceName: 'node_to_node_users',
        commands: ['echo "Hello from users (dependent - should run right after orders) 👋🏽"'],
        healthcheck: () => sleepWithLog(2, 'Sleepidy sleep'),
      },
    ],
  },
])
