import { ExecOpts } from '../../index'
import { teardownSingle } from '../../utils'

const teardown = async (execOpts: ExecOpts) => {
  const { containerId, runnerKey } = execOpts

  return teardownSingle(containerId, runnerKey)
}

export default teardown
