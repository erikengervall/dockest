import { IResources } from '..'
import { IKafkaConfig$Int } from '../DockestConfig'

const kafkaRunner = async (kafkaConfig: IKafkaConfig$Int, resources: IResources): Promise<void> => {
  // const {
  //   Execs: { kafka },
  // } = resources

  // TODO: Implement KafkaJS integration tests
  if (true || kafkaConfig || resources) {
    return
  }
}

export default kafkaRunner
