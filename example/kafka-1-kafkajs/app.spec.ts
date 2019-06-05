import dotenv from 'dotenv'
import main from './app'

const env: any = dotenv.config().parsed
const describeFn = env.kafka_enabled === 'true' ? describe : describe.skip

const test = () => {
  it('trabajo', async () => {
    const result = main()

    expect(result).toEqual(
      expect.objectContaining({
        kafka: expect.any(Object),
      })
    )
  })
}

describeFn('kafka-1-kafkajs', test)
