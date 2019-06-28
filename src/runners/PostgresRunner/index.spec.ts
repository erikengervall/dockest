import PostgresRunner from './index'

const config = {
  database: '_',
  password: '_',
  service: '_',
  username: '_',
}
const postgresRunner1 = new PostgresRunner(config)
const postgresRunner2 = new PostgresRunner(config)

describe('PostgresRunner', () => {
  it('should create unique instances', () => {
    expect(postgresRunner1).not.toBe(postgresRunner2)
  })

  it('should fail validation', () => {
    expect(
      () =>
        // @ts-ignore
        new PostgresRunner({
          database: '_',
          password: '_',
          // service: '_',
          username: '_',
        })
    ).toThrow(/service: Schema-key missing in config/)
  })
})
