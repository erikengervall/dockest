/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react') // eslint-disable-line @typescript-eslint/no-var-requires

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props
    const { baseUrl, docsUrl } = siteConfig
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`
    const langPart = `${language ? `${language}/` : ''}`
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`

    return (
      <div>
        <div className="homeContainer">
          <div className="wrapper homeWrapper">
            <img src={`${baseUrl}img/logo.png`} alt="Project Logo" />

            <div className="inner">
              <h2>
                <small>{siteConfig.tagline}</small>
              </h2>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Index
