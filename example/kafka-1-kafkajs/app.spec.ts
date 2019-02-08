import dotenv from 'dotenv'
import main from './app'

const env: any = dotenv.config().parsed

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
  describe('kafka-1-kafkajs', test)
} else {
  describe.skip('', () => it.skip('', () => undefined))
}
