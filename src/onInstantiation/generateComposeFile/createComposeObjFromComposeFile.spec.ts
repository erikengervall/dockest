import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import createComposeObjFromComposeFile from './createComposeObjFromComposeFile'
import testUtils from '../../testUtils'

const { createDockestConfig } = testUtils({})

describe('createComposeObjFromComposeFile', () => {
  const yamlMock: any = {
    safeLoad: jest.fn(composeYml => yaml.safeLoad(composeYml)),
  }

  const nodeProcessMock: any = {
    cwd: jest.fn(() => path.join(process.cwd(), 'fixtures')),
  }

  beforeEach(() => {
    yamlMock.safeLoad.mockClear()
    nodeProcessMock.cwd.mockClear()
  })

  it('should create composeObj from single service Compose File', () => {
    const dockestConfig = createDockestConfig({
      opts: { composeFile: 'docker-compose-single-redis.yml' },
    })

    const composeObj = createComposeObjFromComposeFile(dockestConfig, yamlMock, nodeProcessMock)

    expect(composeObj).toMatchSnapshot()
  })

  it('should create composeObj from complicated Compose File', () => {
    const dockestConfig = createDockestConfig({
      opts: { composeFile: 'docker-compose-complicated.yml' },
    })

    const composeObj = createComposeObjFromComposeFile(dockestConfig, yamlMock, nodeProcessMock)

    expect(composeObj).toMatchSnapshot()
  })

  describe('multiple Compose Files', () => {
    it('should create composeObj from multiple Compose Files', () => {
      const dockestConfig = createDockestConfig({
        opts: { composeFile: ['docker-compose-single-redis.yml', 'docker-compose-single-postgres.yml'] },
      })

      const composeObj = createComposeObjFromComposeFile(dockestConfig, yamlMock, nodeProcessMock)

      expect(composeObj).toMatchSnapshot()
    })

    it('should merge conflicting names', () => {
      const dockestConfig = createDockestConfig({
        opts: { composeFile: ['docker-compose-single-redis.yml', 'docker-compose-single-redis-duplicate.yml'] },
      })

      const composeObj = createComposeObjFromComposeFile(dockestConfig, yamlMock, nodeProcessMock)

      expect(composeObj).toMatchSnapshot()
    })
  })
})
