import path from 'path'
import createComposeObjFromComposeFile from './createComposeObjFromComposeFile'

describe('createComposeObjFromComposeFile', () => {
  const nodeProcessMock: any = {
    cwd: jest.fn(() => path.join(process.cwd(), 'fixtures')),
  }

  beforeEach(() => {
    nodeProcessMock.cwd.mockClear()
  })

  it('should create composeObj from single service Compose File', () => {
    const composeFile = 'docker-compose-single-redis.yml'
    const composeObj = createComposeObjFromComposeFile([composeFile], nodeProcessMock)

    expect(composeObj).toMatchSnapshot()
  })

  it('should create composeObj from complicated Compose File', () => {
    const composeFile = 'docker-compose-complicated.yml'
    const composeObj = createComposeObjFromComposeFile([composeFile], nodeProcessMock)

    expect(composeObj).toMatchSnapshot()
  })

  describe('multiple Compose Files', () => {
    it('should create composeObj from multiple Compose Files', () => {
      const composeFiles = ['docker-compose-single-redis.yml', 'docker-compose-single-postgres.yml']

      const composeObj = createComposeObjFromComposeFile(composeFiles, nodeProcessMock)

      expect(composeObj).toMatchSnapshot()
    })

    it('should merge conflicting names', () => {
      const composeFiles = ['docker-compose-single-redis.yml', 'docker-compose-single-redis-duplicate.yml']

      const composeObj = createComposeObjFromComposeFile(composeFiles, nodeProcessMock)

      expect(composeObj).toMatchSnapshot()
    })
  })
})
