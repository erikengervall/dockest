import { ExecOpts } from '../../index'
import { teardownSingle } from '../../utils'

export default async (execOpts: ExecOpts) => {
  const { containerId, runnerKey } = execOpts

  return teardownSingle(containerId, runnerKey)
}
