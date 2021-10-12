import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './index.module.css'

const VERSIONS: { version: string; href: string }[] = [
  {
    version: 'latest',
    href: '/docs/introduction',
  },
  {
    version: '2.0.0',
    href:
      'https://github.com/erikengervall/dockest/tree/94bac6f7d11588909fb42d8ce3ebbb3eccc3c49c/website/versioned_docs/version-2.0.0',
  },
  {
    version: '1.0.4',
    href:
      'https://github.com/erikengervall/dockest/tree/94bac6f7d11588909fb42d8ce3ebbb3eccc3c49c/website/versioned_docs/version-1.0.4',
  },
]

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">Docs for different Dockest versions</p>
      </div>
    </header>
  )
}

function VersionsList() {
  return (
    <>
      {VERSIONS.map(version => {
        return (
          <div className={styles.buttons} key={`version-item-${version.version}`} style={{ marginBottom: 20 }}>
            <Link className="button button--secondary button--lg" to={version.href}>
              {version.version}
            </Link>
          </div>
        )
      })}
    </>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout description={siteConfig.tagline}>
      <HomepageHeader />
      <main
        style={{
          paddingTop: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <VersionsList />
      </main>
    </Layout>
  )
}
