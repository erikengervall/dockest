const createRedis = () => {
  const redis = require('redis')

  const client = redis.createClient()
  const redisKey = 'redisKey'
  const redisValue = 'redisValue'

  client.on('error', function(err) {
    console.log('Error ' + err)
  })

  client.set(redisKey, redisValue)
  const getRedisKeyResult = client.get(redisKey)

  console.log(
    'getRedisKeyResult:',
    getRedisKeyResult,
    ', is equal to set value?:',
    getRedisKeyResult === redisValue
  )

  client.quit()
}

module.exports = createRedis
