import Link from '@docusaurus/Link'
import React from 'react'

import styles from './VersionsList.module.css'

interface Version {
  version: string
  href: string
}

const VERSIONS: Version[] = [
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

export function VersionsList() {
  return (
    <section className={styles.versions}>
      <h1 className={styles.versionsTitle}>Versions</h1>

      {VERSIONS.map(version => {
        return (
          <div className={styles.buttons} key={`version-item-${version.version}`} style={{ marginBottom: 20 }}>
            <Link className="button button--secondary button--lg" to={version.href}>
              {version.version}
            </Link>
          </div>
        )
      })}
    </section>
  )
}
