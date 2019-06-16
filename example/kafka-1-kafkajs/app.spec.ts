import dotenv from 'dotenv'
import main from './app'

const env = dotenv.config().parsed
const describeFn = env.kafka1confluentinc_enabled === 'true' ? describe : describe.skip

const test = () => {
  it('trabajo', async () => {
    const indicateConsumption = jest.fn()
    const indicateProduction = jest.fn()

    const result = await main({ indicateConsumption, indicateProduction })

    expect(result).toEqual(
      expect.objectContaining({
        kafka: expect.any(Object),
      })
    )
  })
}

describeFn('kafka-1-kafkajs', test)
