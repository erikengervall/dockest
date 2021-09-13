module.exports = {
  title: 'Dockest',
  tagline:
    'Dockest is an integration testing tool aimed at alleviating the process of evaluating unit tests whilst running multi-container Docker applications.',
  url: 'https://erikengervall.github.io',
  baseUrl: '/dockest/',
  // baseUrl: '/',
  organizationName: 'erikengervall',
  projectName: 'dockest',
  scripts: ['https://buttons.github.io/buttons.js'],
  favicon: 'img/favicon.png',
  customFields: {
    repoUrl: 'https://github.com/erikengervall/dockest',
    npmUrl: 'https://www.npmjs.com/package/dockest',
    engineeringBlogPostUrl: 'https://engineering.klarna.com/node-js-integration-testing-with-ease-fab5f8d29163',
  },
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: './docs',
          sidebarPath: './sidebars.json',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {},
        theme: {
          customCss: '../src/css/customTheme.css',
        },
      },
    ],
  ],
  plugins: [],
  themeConfig: {
    navbar: {
      title: 'Dockest',
      items: [
        {
          to: 'docs/introduction/',
          label: 'Docs',
          position: 'left',
        },
        {
          label: 'Version',
          to: 'docs/introduction',
          position: 'right',
          items: [
            {
              label: '3.0.0',
              to: 'docs/introduction',
              activeBaseRegex: 'docs/(?!1.0.4|2.0.0|3.0.0|next)',
            },
            {
              label: '2.0.0',
              to: 'docs/2.0.0/introduction',
            },
            {
              label: '1.0.4',
              to: 'docs/1.0.4/introduction',
            },
            {
              label: 'Main/Unreleased',
              to: 'docs/next/introduction',
              activeBaseRegex: 'docs/next/(?!support|team|resources)',
            },
          ],
        },
      ],
    },
    footer: {
      links: [],
      copyright: 'Copyright © 2021 Erik Engervall',
      logo: {},
    },
    algolia: {
      apiKey: '9bf9f3d6b00b633293ccea7bbd73a7d1',
      indexName: 'dockest',
      algoliaOptions: {},
    },
  },
}
