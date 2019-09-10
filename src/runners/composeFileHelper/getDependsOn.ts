import { Runner } from '../@types'

export default (dependsOn: Runner[]) =>
  dependsOn.length > 0
    ? {
        depends_on: dependsOn.map(({ runnerConfig: { service } }) => service), // eslint-disable-line @typescript-eslint/camelcase
      }
    : {}
