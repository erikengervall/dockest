import PostgresRunner from './'

const config = {
  service: '_',
  image: '_',
  database: '_',
  password: '_',
  username: '_',
}
const postgresRunner1 = new PostgresRunner(config)
const postgresRunner2 = new PostgresRunner(config)

describe('PostgresRunner', () => {
  it('should create unique instances', () => {
    expect(postgresRunner1).not.toBe(postgresRunner2)
  })
})
