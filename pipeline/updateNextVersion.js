const { resolve } = require('path')
const { writeFileSync } = require('fs')
const { execSync } = require('child_process')

const pathToPackageJson = resolve(process.cwd(), 'packages/dockest/package.json')
const packageJson = require(pathToPackageJson)

const updateNextVersion = () => {
  console.log('> updateNextVersion')

  const currentVersion = packageJson.version
  const commitSha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim()
  const commitShaShort = commitSha.substr(0, 7)
  const nextVersion = `${currentVersion}-${commitShaShort}`

  const dockestMeta = {
    commitShaShort,
    commitSha,
    nextVersion,
  }

  packageJson.version = nextVersion
  packageJson.dockest = dockestMeta

  writeFileSync(pathToPackageJson, JSON.stringify(packageJson, null, 2))

  console.log('>> updateNextVersion', dockestMeta)
}

updateNextVersion()
