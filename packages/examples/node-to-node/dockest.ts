import { Dockest, logLevel } from 'dockest'

const { run } = new Dockest({
  afterSetupSleep: 1,
  dumpErrors: true,
  logLevel: logLevel.DEBUG,
  composeFile: 'docker-compose.yml',
})

run([{ serviceName: 'node_to_node_users' }, { serviceName: 'node_to_node_orders' }])
