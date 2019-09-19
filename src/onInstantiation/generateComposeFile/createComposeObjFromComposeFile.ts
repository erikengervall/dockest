import { default as fsLib } from 'fs'
import { mergeDeepRight } from 'ramda'
import { default as yamlLib } from 'js-yaml'
import { DockestConfig } from '../../index'
import { ComposeFile } from '../../runners/@types'

export default (config: DockestConfig, fs = fsLib, yaml = yamlLib, nodeProcess = process): ComposeFile => {
  const getComposeObjFromComposeFile = (fileName: string) => {
    const composeYml = fs.readFileSync(`${nodeProcess.cwd()}/${fileName}`, 'utf8')
    const composeObj: ComposeFile = yaml.safeLoad(composeYml)

    return composeObj
  }

  let composeObj = {
    version: '3',
    services: {},
  }

  const { composeFile } = config.opts
  if (composeFile.length > 0) {
    const composeObjsFromFile = Array.isArray(composeFile)
      ? composeFile.map(fileName => getComposeObjFromComposeFile(fileName))
      : [getComposeObjFromComposeFile(composeFile)]

    composeObjsFromFile.forEach(composeObjFromFile => {
      composeObj = mergeDeepRight(composeObj, composeObjFromFile)
    })
  }

  return composeObj
}
