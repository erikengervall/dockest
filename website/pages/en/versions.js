/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

const CompLibrary = require('../../core/CompLibrary')

const Container = CompLibrary.Container

const CWD = process.cwd()

const versions = require(`${CWD}/versions.json`)

function Versions(props) {
  const { config: siteConfig } = props
  const latestVersion = versions.filter(v => !v.includes('alpha') && !v.includes('beta'))[0]
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${siteConfig.projectName}`
  const preReleases = versions.filter(v => v.includes('alpha') || v.includes('beta'))
  // const pastVersions = versions.filter(v => !v.includes('alpha') && !v.includes('beta') && v !== latestVersion)

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} Versions</h1>
          </header>

          <h3 id="latest">Current version (Stable)</h3>
          <p>Latest stable version of Dockest</p>
          <table className="versions">
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <a href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/introduction`}>Documentation</a>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            This is the version that is installed when running{' '}
            <span style={{ fontWeight: 'bold' }}>yarn add dockest</span>
          </p>

          <h3 id="rc">Latest version</h3>
          <p>Here you can find the latest unreleased documentation and code</p>
          <table className="versions">
            <tbody>
              <tr>
                <th>master</th>
                <td>
                  <a href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/next/introduction`}>Documentation</a>
                </td>
                <td>
                  <a href={repoUrl}>Source Code</a>
                </td>
              </tr>
            </tbody>
          </table>

          <h3 id="archive">Pre-relase Versions</h3>
          <p>Here you can find previous versions of the documentation</p>
          <table className="versions">
            <tbody>
              {preReleases.map(version => (
                <tr>
                  <th>{version}</th>
                  <td>
                    <a href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${version}/introduction`}>Documentation</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            You can find past versions of this project on <a href={repoUrl}>GitHub</a> or{' '}
            <a href={siteConfig.npmUrl}>npm</a>
          </p>

          {/* <h3 id="archive">Past Versions</h3>
          <p>Here you can find previous versions of the documentation</p>
          <table className="versions">
            <tbody>
              {pastVersions.map(version => (
                <tr>
                  <th>{version}</th>
                  <td>
                    <a href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${version}/introduction`}>Documentation</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            You can find past versions of this project on <a href={repoUrl}>GitHub</a> or{' '}
            <a href={siteConfig.npmUrl}>npm</a>
          </p> */}
        </div>
      </Container>
    </div>
  )
}

module.exports = Versions
