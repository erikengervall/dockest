import execa from 'execa'

import { IRedisConfig$Int } from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import DockestError from '../error/DockestError'
import { sleep } from './utils'

type startRedisContainer = () => Promise<void>
type checkRedisConnection = (redisConfig: IRedisConfig$Int) => Promise<void>

export interface IRedis {
  startRedisContainer: startRedisContainer;
  checkRedisConnection: checkRedisConnection;
}

const createRedis = (Logger: DockestLogger): IRedis => {
  const startRedisContainer: startRedisContainer = async () => {
    Logger.loading('Starting Redis container')

    await execa.shell('')

    Logger.success('Redis container started successfully')
  }

  const checkRedisConnection: checkRedisConnection = async redisConfig => {
    Logger.loading('Attempting to establish Redis connection')

    const { connectionTimeout: timeout = 3 } = redisConfig

    const recurse = async (timeout: number) => {
      Logger.info(`Establishing Redis connection (Timing out in: ${timeout}s)`)

      if (timeout <= 0) {
        throw new DockestError('Redis connection timed out')
      }

      try {
        await execa.shell('')

        Logger.success('Redis connection established')
      } catch (error) {
        timeout--

        await sleep(1000)
        await recurse(timeout)
      }
    }

    await recurse(timeout)
  }

  return {
    startRedisContainer,
    checkRedisConnection,
  }
}

export default createRedis
