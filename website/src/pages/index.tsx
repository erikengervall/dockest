import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

import HomepageFeatures from '../components/HomepageFeatures'
import styles from './index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/introduction">
            Docs
          </Link>
        </div>
      </div>
    </header>
  )
}

interface HomeProps {
  MainContent: React.ReactNode
}

export default function Home({ MainContent = <HomepageFeatures /> }: HomeProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout description={siteConfig.tagline}>
      <HomepageHeader />

      <main>{MainContent}</main>
    </Layout>
  )
}
