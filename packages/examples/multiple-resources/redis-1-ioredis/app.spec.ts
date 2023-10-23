import { app } from './app';

const { seedCake } = require('./data.json'); // eslint-disable-line @typescript-eslint/no-var-requires

describe('redis-1-ioredis', () => {
  it('should retrieve seeded value', async () => {
    const { redis } = app();

    const value = await redis.get(seedCake.key);
    expect(value).toMatchSnapshot();
  });

  it('should handle flushall', async () => {
    const { redis } = app();

    await redis.flushall();

    const flushedValue = await redis.get(seedCake.key);
    expect(flushedValue).toEqual(null);
  });
});
