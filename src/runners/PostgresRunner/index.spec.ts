import PostgresRunner from './index'

const postgresRunner1 = new PostgresRunner({
  service: 'pg1',
  database: '_',
  password: '_',
  username: '_',
})
const postgresRunner2 = new PostgresRunner({
  service: 'pg2',
  database: '_',
  password: '_',
  username: '_',
})

describe('PostgresRunner', () => {
  it('should create unique instances', () => {
    expect(postgresRunner1).not.toBe(postgresRunner2)
  })

  it('should fail validation', () => {
    expect(
      () =>
        // @ts-ignore
        new PostgresRunner({ database: '_', password: '_', username: '_' })
    ).toThrow(/service: Schema-key missing in config/)
  })
})
