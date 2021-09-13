/* eslint-disable react/prop-types */
import React from 'react'

// eslint-disable-next-line no-undef
const CWD = process.cwd()
const versions = require(`${CWD}/versions.json`)

function Versions({ config: siteConfig }) {
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${siteConfig.projectName}`

  const stableReleases = versions.filter(v => !v.includes('alpha') && !v.includes('beta'))
  const preReleases = versions.filter(v => v.includes('alpha') || v.includes('beta'))

  return (
    <div className="docMainWrapper wrapper">
      <div className="mainContainer versionsContainer">
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
              {stableReleases.map((stableRelease, i) => (
                <tr key={stableRelease}>
                  <th style={{ fontWeight: 'bold' }}>{stableRelease}</th>
                  <td>
                    <a
                      href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                        i === 0 ? '' : `${stableRelease}/`
                      }introduction`}
                    >
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
              {preReleases.map(preRelease => (
                <tr key={preRelease}>
                  <th style={{ fontWeight: 'bold' }}>{preRelease}</th>
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
      </div>
    </div>
  )
}

export default Versions
