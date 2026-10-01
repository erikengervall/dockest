const { resolve } = require('path')
const { writeFileSync } = require('fs')
const { execSync } = require('child_process')

const pathToPackageJson = resolve(process.cwd(), 'packages/dockest/package.json')
const packageJson = require(pathToPackageJson)

/**
 * A `next` build must sort above the release it is built on, so a release version gets its patch bumped:
 * 3.2.0 -> 3.2.1-next.<run>.g<sha>. A prerelease keeps its version and gains the suffix:
 * 3.2.0-beta.0 -> 3.2.0-beta.0.next.<run>.g<sha>. The `g` prefix keeps an all-digit sha with a leading zero
 * from being an invalid numeric semver identifier.
 */
const getNextVersion = (currentVersion, runNumber, commitShaShort) => {
  const suffix = `next.${runNumber}.g${commitShaShort}`
  const [release, prerelease] = currentVersion.split('-')

  if (prerelease) {
    return `${currentVersion}.${suffix}`
  }

  const [major, minor, patch] = release.split('.').map(Number)
  return `${major}.${minor}.${patch + 1}-${suffix}`
}

const updateNextVersion = () => {
  console.log('> updateNextVersion')

  const currentVersion = packageJson.version
  const commitSha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim()
  const commitShaShort = commitSha.slice(0, 7)
  const runNumber = process.env.GITHUB_RUN_NUMBER || '0'
  const nextVersion = getNextVersion(currentVersion, runNumber, commitShaShort)

  const dockestMeta = {
    commitShaShort,
    commitSha,
    nextVersion,
  }

  packageJson.version = nextVersion
  packageJson.dockest = dockestMeta

  writeFileSync(pathToPackageJson, `${JSON.stringify(packageJson, null, 2)}\n`)

  console.log('>> updateNextVersion', dockestMeta)
}

if (require.main === module) {
  updateNextVersion()
}

module.exports = { getNextVersion }
