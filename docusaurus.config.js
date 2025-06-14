// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '90DevOps Roxs',
  tagline: 'Learn DevOps',
  favicon: 'img/favicon.ico',
  url: 'https://roxs.295devops.com',
  baseUrl: '/',
  organizationName: 'roxsross',
  projectName: '90devops-roxs',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/'
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/devops-repo-card.png',
      navbar: {
        title: '90 Días de DevOps con Roxs',
        logo: {
          alt: 'DevOps Logo',
          src: 'img/295.png',
        },
        items: [
          {
            href: 'https://github.com/roxsross/roxs-devops-project90.git',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://twitter.com/roxsross',
            label: 'Twitter',
            position: 'right',
          },
          {
            href: 'https://www.youtube.com/@295devops',
            label: 'Youtube',
            position: 'right',
          },
          {
            href: 'https://www.linkedin.com/in/roxsross/',
            label: 'LinkedIn',
            position: 'right',
          },
          {
            href: 'https://discord.com/invite/RWQjCRaVJ3',
            label: 'Discord',
            position: 'right',
          }
        ],
      },
      footer: {
        logo: {
          alt: 'DevOps',
          src: 'img/295.png',
          href: 'https://roxs.295devops.com',
        },
        style: 'light',
        copyright: `Copyright © ${new Date().getFullYear()} Rossana Suarez @roxsross`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
