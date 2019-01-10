const { default: Dockest } = require('../built')
const config = require('./.dockestrc')

Dockest(config)
