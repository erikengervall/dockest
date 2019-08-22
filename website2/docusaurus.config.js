/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Dockest',
  tagline:
    'Dockest is an integration testing tool aimed at alleviating the process of evaluating unit tests whilst running multi-container Docker applications',
  url: 'https://erikengervall.github.io/dockest/',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'erikengervall', // Usually your GitHub org/user name.
  projectName: 'Dockest', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Dockest',
      links: [
        { to: 'docs/introduction', label: 'Docs', position: 'left' },
        { to: 'docs/typedoc/index', label: 'Typedocs', position: 'left' },
        { href: 'https://github.com/erikengervall/dockest', label: 'GitHub', position: 'right' },
      ],
    },
    // footer: {
    //   style: 'dark',
    //   copyright: `Copyright © ${new Date().getFullYear()} Engervall`,
    // },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
