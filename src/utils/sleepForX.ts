import Logger from '../Logger'
import sleep from './sleep'

export default async (reason = '', secondsToSleep: number = 30): Promise<void> => {
  for (let i = 0; i < secondsToSleep; i++) {
    Logger.replacePrevLine(`${reason}: ${i + 1}/${secondsToSleep}`, i === secondsToSleep - 1)

    await sleep()
  }
}
