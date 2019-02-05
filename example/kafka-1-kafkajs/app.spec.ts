import dotenv from 'dotenv'
import main from './app'

const env: any = dotenv.config().parsed

const describeName = 'kafka-1-kafkajs'
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

if (env.kafka_enabled === 'true') {
  describe(describeName, test)
} else {
  describe.skip(describeName, test)
}
