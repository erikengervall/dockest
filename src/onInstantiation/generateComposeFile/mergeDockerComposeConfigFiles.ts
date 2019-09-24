import execa from 'execa'
import path from 'path'
import getComposeObjFromComposeYmlString from './getComposeObjFromComposeYmlString'

export default (cwd: string, composeFiles: string[]) => {
  const result = execa.sync(
    'docker-compose',
    composeFiles
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
    console.error(
      `🚨 Invalid docker-compose config: \n ${result.stderr}\n\n You can declare the given option via your runner definition or preferably the compose file. \n`,
    )
    throw new TypeError('Invalid docker-compose config.')
  }

  return getComposeObjFromComposeYmlString(result.stdout)
}
