import * as dockestExport from './index'

describe('Dockest', () => {
  it('should export the expected members', () => {
    expect(dockestExport).toEqual({
      default: expect.any(Function),
      execa: expect.any(Function),
      logLevel: {
        DEBUG: expect.any(Number),
        ERROR: expect.any(Number),
        INFO: expect.any(Number),
        NOTHING: expect.any(Number),
        WARN: expect.any(Number),
      },
      runners: {
        KafkaRunner: expect.any(Function),
        PostgresRunner: expect.any(Function),
        RedisRunner: expect.any(Function),
        ZooKeeperRunner: expect.any(Function),
        SimpleRunner: expect.any(Function),
      },
      sleep: expect.any(Function),
    })
  })

  it('should be initializable and expose the main run method', () => {
    const Dockest = dockestExport.default
    const RedisRunner = dockestExport.runners.RedisRunner
    const redisRunner = new RedisRunner({ service: '_', image: '_' })

    const dockest = new Dockest({ runners: [redisRunner] })

    expect(dockest).toBeInstanceOf(Dockest)
    expect(dockest).toEqual(
      expect.objectContaining({
        config: expect.objectContaining({
          runners: expect.arrayContaining([redisRunner]),
        }),
        run: expect.any(Function),
      }),
    )
  })
})
