/* eslint-disable react/prop-types */
import React from 'react'
import Layout from '@theme/Layout'

const Button = props => (
  <a className="button" href={props.href} target={props.target}>
    {props.children}
  </a>
)

class Index extends React.Component {
  render() {
    const { config: siteConfig } = this.props

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        <img
          style={{ maxWidth: '350px', marginBottom: '50px' }}
          src={`${siteConfig.baseUrl}img/logo.svg`}
          alt={siteConfig.title}
          aria-label="https://github.com/erikengervall/dockest"
        />

        <small>{siteConfig.tagline}</small>
      </h2>
    )

    const Features = () => (
      <div className="features">
        <div className="feature">
          <h6>Good old JavaScript</h6>
          <p>Dockest abstracts away the need for extensive Docker knowledge and eliminates funky bash scripts</p>
        </div>
        <div className="feature">
          <h6>Completely modular and extendable</h6>
          <p>Dockest is built with modularity in mind, making introduction of new types of services a breeze</p>
        </div>
        <div className="feature">
          <h6>Naturally extends your development environment</h6>
          <p>Dockest utilizes Docker Compose, the very same tool most developers use during development</p>
        </div>
      </div>
    )

    return (
      <Layout title={siteConfig.title} description={siteConfig.tagline}>
        <ProjectTitle siteConfig={siteConfig} />

        <main>
          <div className="buttons">
            <div>
              <Button href={`${siteConfig.baseUrl}docs/introduction`}>Documentation</Button>
            </div>

            <div>
              <Button target="_blank" href={siteConfig.customFields.repoUrl}>
                Github
              </Button>
            </div>
          </div>

          <Features />
        </main>
      </Layout>
    )
  }
}

export default Index
