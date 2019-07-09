import globalLogger from '../loggers/globalLogger'
import sleep from './sleep'

export default async (reason = '', secondsToSleep: number = 30): Promise<void> => {
  for (let i = 0; i < secondsToSleep; i++) {
    globalLogger.sleepForX(reason, `${i + 1}/${secondsToSleep}`, i === secondsToSleep - 1)

    await sleep()
  }
}
