import { ExecOpts } from '../index'
import { teardownSingle } from '../utils'

export default async (execConfig: ExecOpts) => {
  const { containerId, runnerKey } = execConfig

  return teardownSingle(containerId, runnerKey)
}
