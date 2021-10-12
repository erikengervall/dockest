/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import clsx from 'clsx'
import React from 'react'

import styles from './HomepageFeatures.module.css'

type FeatureItem = {
  title: string
  image: string
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: 'Good old JavaScript',
    image: '/static/img/undraw_web_development_w2vv.svg',
    description: <>Dockest abstracts away the need for extensive Docker knowledge and eliminates funky bash scripts</>,
  },
  {
    title: 'Completely modular and extendable',
    image: '/static/img/undraw_Create_re_57a3.svg',
    description: <>Dockest is built with modularity in mind, making introduction of new types of services a breeze</>,
  },
  {
    title: 'Naturally extends your development environment',
    image: '/static/img/undraw_Developer_activity_re_39tg.svg',
    description: <>Dockest utilizes Docker Compose, the very same tool most developers use during development</>,
  },
]

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
