import { IResources } from '..'
import { IRedisConfig$Int } from '../DockestConfig'

const kafkaRunner = async (redisConfig: IRedisConfig$Int, resources: IResources): Promise<void> => {
  // const {
  //   Execs: { redis },
  // } = resources

  // TODO: Implement Redis integration tests
  if (true || redisConfig || resources) {
    return
  }
}

export default kafkaRunner
