import { sleep } from './sleep'
import { Logger } from '../Logger'

export const sleepWithLog = async (seconds = 30, reason = 'Sleeping...') => {
  for (let progress = 1; progress <= seconds; progress++) {
    Logger.replacePrevLine({
      message: `${reason}: ${progress}/${seconds}`,
      isLast: progress === seconds,
    })

    await sleep(1000)
  }
}
