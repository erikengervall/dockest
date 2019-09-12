/* eslint-disable @typescript-eslint/ban-ts-ignore */

import PostgresRunner from './index'

const postgresRunner1 = new PostgresRunner({
  service: 'pg1',
  image: 'some/image:123',
  database: '_',
  password: '_',
  username: '_',
})
const postgresRunner2 = new PostgresRunner({
  service: 'pg2',
  image: 'some/image:123',
  database: '_',
  password: '_',
  username: '_',
})

describe('PostgresRunner', () => {
  it('should create unique instances', () => {
    expect(postgresRunner1).not.toBe(postgresRunner2)
    expect(postgresRunner1).toMatchSnapshot()
    expect(postgresRunner2).toMatchSnapshot()
  })

  it('should fail validation', () => {
    // @ts-ignore
    expect(() => new PostgresRunner({ database: '_', password: '_', username: '_' })).toThrow(
      /service: Schema-key missing in config/,
    )
  })
})
