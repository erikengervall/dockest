/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: {
    'Getting started': ['introduction', 'example'],
    Interfaces: [
      'dockest_constructor',
      'jest',
      {
        type: 'category',
        label: 'Runners',
        items: ['runner_redis', 'runner_postgres', 'runner_zookeeper', 'runner_kafka'],
      },
    ],
    Healthchecks: ['connectivity', 'responsiveness'],
    Docusaurus: ['doc1', 'doc2', 'doc3'],
    Features: ['mdx'],
  },
}
