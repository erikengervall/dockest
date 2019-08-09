import dotenv from 'dotenv'
import main from './app'
import { sleep } from '../../../src'
import { runOrSkip } from '../testUtils'

jest.setTimeout(1000 * 60)
const env = dotenv.config().parsed

const waitForEventConsumption = async (
  targetCount: number,
  endBatchProcessListener: (args: { counter: number }) => void,
  startConsuming: () => Promise<void>,
  emit: () => Promise<void>,
  timeout: number = 15,
): Promise<void> => {
  const opts = { counter: 0 }
  endBatchProcessListener(opts)
  await startConsuming()

  await sleep(100) // FIXME: Investigate why the consumer doesn't consume messages without this sleep
  await emit()

  const recurse = async (): Promise<void> => {
    timeout--

    // eslint-disable-next-line no-console
    console.log(
      `⏳ Waiting for published events to be consumed (Progress: ${opts.counter}/${targetCount}) (Timeout in: ${timeout}s)`,
    )
    if (timeout <= 0) {
      throw new Error('❌ Waiting for event consumption timed out')
    }

    if (opts.counter === targetCount) {
      // eslint-disable-next-line no-console
      return console.log(`✅ Successfully consumed ${opts.counter}/${targetCount} messages`)
    }

    await sleep(1000)
    await recurse()
  }

  await recurse()
}

const specWrapper = () => {
  const mockProductionCallback = jest.fn()
  const mockConsumptionCallback = jest.fn()
  const messages = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const key = 'arbitrary key 🌮'

  beforeEach(() => {
    mockProductionCallback.mockClear()
    mockConsumptionCallback.mockClear()
  })

  describe('kafka-1-kafkajs', () => {
    it('should be able to produce and consume kafka events', async () => {
      const { consumer, emit, startConsuming, stopConsuming } = main(
        key,
        messages,
        mockConsumptionCallback,
        mockProductionCallback,
      )

      await waitForEventConsumption(
        messages.length,
        opts => {
          consumer.on(consumer.events.END_BATCH_PROCESS, ({ payload: { batchSize } }) => {
            opts.counter += batchSize
          })
        },
        startConsuming,
        emit,
      )
      await stopConsuming()

      expect(mockProductionCallback).toHaveBeenCalledWith({
        acks: 1,
        messages: messages.map(message => ({ key, value: message })),
        topic: env.kafka1confluentinc_topic,
      })
      messages.forEach(message => {
        expect(mockConsumptionCallback).toHaveBeenCalledWith({
          messageHeaders: {},
          messageKey: key,
          messageValue: message,
          partition: 0,
          topic: env.kafka1confluentinc_topic,
        })
      })
    })
  })
}

runOrSkip(env.kafka1confluentinc_enabled, specWrapper)
