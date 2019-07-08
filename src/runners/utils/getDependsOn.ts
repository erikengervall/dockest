import { Runner } from '../@types'

const getDependsOn = (dependsOn: Runner[]): { depends_on?: string[] } =>
  dependsOn.length > 0
    ? { depends_on: dependsOn.map(({ runnerConfig: { service } }) => service) }
    : {}

export default getDependsOn
