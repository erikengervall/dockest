import RunnerUtilsLogger from '../../loggers/RunnerUtilsLogger'

const sleep = (ms: number = 1000): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

const sleepWithLog = async (reason = '', secondsToSleep: number = 30): Promise<void> => {
  for (let i = 0; i < secondsToSleep; i++) {
    RunnerUtilsLogger.sleepWithLog(reason, `${i + 1}/${secondsToSleep}`)

    await sleep()
  }
}

export { sleepWithLog }
export default sleep
