// tslint:disable:no-console

import dotenv from 'dotenv'
import { sleep } from '../../src'
import { runOrSkip } from '../testUtils'
import main from './app'

jest.setTimeout(1000 * 30)
const env = dotenv.config().parsed

const waitForEventConsumption = async (
  targetCount: number,
  listener: (args: { counter: number }) => void,
  timeout: number = 15
): Promise<void> => {
  const opts = { counter: 0 }
  listener(opts)

  const recurse = async (): Promise<void> => {
    timeout--
    console.log(
      `⏳ Waiting for published events to be consumed (Progress: ${opts.counter}/${targetCount}) (Timeout in: ${timeout}s)`
    )
    if (timeout <= 0) {
      throw new Error('❌ Waiting for event consumption timed out')
    }

    if (opts.counter === targetCount) {
      console.log(`✅ Successfully consumed ${opts.counter}/${targetCount} messages`)
      return
    }

    await sleep(1000)
    await recurse()
  }

  await recurse()
}

const specWrapper = () =>
  describe('kafka-1-kafkajs', () => {
    it('trabajo', async () => {
      const mockProductionCallback = jest.fn()
      const mockConsumptionCallback = jest.fn()
      const messages = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      const key = 'arbitrary 🤷🏼‍♂️'

      const { consumer } = await main(
        key,
        messages,
        mockConsumptionCallback,
        mockProductionCallback
      )

      await waitForEventConsumption(messages.length, args => {
        consumer.on(
          consumer.events.END_BATCH_PROCESS,
          ({ payload: { batchSize } }) => (args.counter += batchSize)
        )
      })

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

runOrSkip(env.kafka1confluentinc_enabled, specWrapper)
