import { Dockest, logLevel, sleepWithLog } from 'dockest';

const { run } = new Dockest({
  composeFile: 'docker-compose.yml',
  dumpErrors: true,
  jestLib: require('jest'),
  logLevel: logLevel.DEBUG,
});

run([
  {
    serviceName: 'node_to_node_orders',
    commands: ['echo "Hello from orders (dependency - should run first) 👋🏽"'],
    dependsOn: [
      {
        serviceName: 'node_to_node_users',
        commands: ['echo "Hello from users (dependent - should run right after orders) 👋🏽"'],
        readinessCheck: () => sleepWithLog(2, 'Sleepidy sleep'),
      },
    ],
  },
]);
