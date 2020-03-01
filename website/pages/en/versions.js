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

function Versions({ config: siteConfig }) {
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${siteConfig.projectName}`

  const stableReleases = versions.filter(v => /[0-9]\.[0-9]\.[0-9]$/g.test(v))
  const preReleases = versions.filter(v => !/[0-9]\.[0-9]\.[0-9]$/g.test(v))

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} Versions</h1>
          </header>

          <h3 id="master">Latest version</h3>
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

          <h3 id="stable-releases">Stable versions</h3>
          <p>Here you can find the current as well as previous versions of the documentation</p>
          <table className="versions">
            <tbody>
              {stableReleases
                .sort((a, b) => a < b)
                .map((stableRelease, i) => (
                  <tr key={stableRelease}>
                    <th style={{ fontWeight: i === 0 ? 'bold' : 'normal' }}>{stableRelease}</th>
                    <td>
                      <a href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${stableRelease}/introduction`}>
                        Documentation
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p>
            You can find past versions of this project on <a href={repoUrl}>GitHub</a> or{' '}
            <a href={siteConfig.npmUrl}>npm</a>
          </p>

          <h3 id="pre-releases">Pre-releases</h3>
          <p>Here you can find previous versions of the documentation</p>
          <table className="versions">
            <tbody>
              {preReleases.map((preRelease, i) => (
                <tr key={preRelease}>
                  <th style={{ fontWeight: i === 0 ? 'bold' : 'normal' }}>{preRelease}</th>
                  <td>
                    <a href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${preRelease}/introduction`}>Documentation</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            You can find past versions of this project on <a href={repoUrl}>GitHub</a> or{' '}
            <a href={siteConfig.npmUrl}>npm</a>
          </p>
        </div>
      </Container>
    </div>
  )
}

module.exports = Versions
