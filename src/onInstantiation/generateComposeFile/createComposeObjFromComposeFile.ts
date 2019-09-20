import { default as yamlLib } from 'js-yaml'
import execa from 'execa'
import * as path from 'path'
import { DockestConfig } from '../../index'
import { ComposeFile } from '../../runners/@types'

export default (config: DockestConfig, yaml = yamlLib, nodeProcess = process): ComposeFile => {
  const getComposeObjFromComposeYmlString = (composeYml: string) => {
    const composeObj: ComposeFile = yaml.safeLoad(composeYml)
    return composeObj
  }

  const cwd = nodeProcess.cwd()

  let composeObj = {
    version: '3',
    services: {},
  }

  let { composeFile } = config.opts
  if (composeFile.length > 0) {
    if (!Array.isArray(composeFile)) {
      composeFile = [composeFile]
    }
    const result = execa.sync(
      'docker-compose',
      composeFile
        .slice()
        .reverse()
        .reduce(
          (result, composeFilePath) => {
            result.unshift('-f', path.join(cwd, composeFilePath))
            return result
          },
          ['config'],
        ),
      {
        reject: false,
      },
    )

    if (result.exitCode !== 0) {
      console.error(`🚨 Invalid docker-compose config: \n ${result.stderr}`)
      throw new TypeError('Invalid docker-compose config.')
    }

    composeObj = getComposeObjFromComposeYmlString(result.stdout)
  }

  return composeObj
}
