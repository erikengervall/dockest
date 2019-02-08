import sleep from './sleep'

const defaultSleep = 1000

describe('sleep', () => {
  describe('happy', () => {
    it('should sleep for default time', async () => {
      const flakynessBuffer = 5
      const beforeSleep = Date.now()

      await sleep()
      const afterSleep = Date.now() + flakynessBuffer
      const totalSleep = afterSleep - beforeSleep

      expect(totalSleep).toBeGreaterThan(defaultSleep)
    })

    it('should sleep for custom time', async () => {
      const flakynessBuffer = 5
      const customSleep = 100
      const beforeSleep = Date.now()

      await sleep(customSleep)
      const afterSleep = Date.now() + flakynessBuffer
      const totalSleep = afterSleep - beforeSleep

      expect(totalSleep).toBeGreaterThan(customSleep)
    })
  })
})
