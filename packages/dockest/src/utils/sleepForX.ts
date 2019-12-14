import { sleep } from './sleep'
import { Logger } from '../Logger'

export const sleepForX = async (reason = '', secondsToSleep = 30) => {
  for (let i = 0; i < secondsToSleep; i++) {
    Logger.replacePrevLine(`${reason}: ${i + 1}/${secondsToSleep}`, i === secondsToSleep - 1)

    await sleep()
  }
}
