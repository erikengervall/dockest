import PostgresRunner from './index'

const config = {
  service: 'anything',
  host: 'anything',
  database: 'anything',
  port: 1,
  password: 'anything',
  username: 'anything',
  commands: [],
  connectionTimeout: 1,
  responsivenessTimeout: 1,
}
const postgresRunner1 = new PostgresRunner(config)
const postgresRunner2 = new PostgresRunner(config)

describe('PostgresRunner', () => {
  it('should create unique instances', () => {
    expect(postgresRunner1).not.toBe(postgresRunner2)
  })
})
