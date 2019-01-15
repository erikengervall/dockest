const Redis = require('ioredis')

const createRedis = () => {
  const redis = new Redis({ host: '127.0.0.1', port: 6379 })
  const redisKey = 'someKey'

  return {
    redis,
    redisKey,
  }
}

module.exports = createRedis
