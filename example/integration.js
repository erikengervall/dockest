const config = require('./.dockestrc.js')
const { default: Dockest } = require('../built')

Dockest(config)
