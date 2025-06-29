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

  themes: ['@docusaurus/theme-mermaid'],
  
  markdown: {
    mermaid: true,
  },
  
  plugins: [],

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
        style: 'dark',
        logo: {
          alt: '295DevOps Logo',
          src: 'img/295.png',
          href: 'https://roxs.295devops.com',
          width: 60,
          height: 60,
        },
        links: [
          {
            title: '📚 Contenido',
            items: [
              {
                label: '🏠 Inicio',
                to: '/',
              },
              {
                label: '📖 DevOps',
                to: '/devops',
              },
              {
                label: '🗺️ Roadmap',
                to: '/roadmap',
              },
              {
                label: '🔥 Proyecto Fuego',
                to: '/proyect-fuego',
              },
              {
                label: '📅 Plan de Estudio',
                to: '/plan-de-estudio',
              },
            ],
          },
          {
            title: '🛠️ Herramientas & Proyectos',
            items: [
              {
                label: '⚙️ DevOps Tools',
                to: '/DevOps-Tools/tools',
              },
              {
                label: '🐧 Linux Comandos',
                to: '/DevOps-Tools/tools',
              },
              {
                label: '🎮 Playgrounds',
                to: '/DevOps-Tools/playgrounds',
              },
              {
                label: '💻 VS Code',
                to: '/DevOps-Tools/vsc',
              },
              {
                label: '📚 Libros DevOps',
                to: '/Libros/libros-devops-1',
              },
            ],
          },
          {
            title: '🚀 Comunidad',
            items: [
              {
                label: '📺 YouTube Live',
                to: '/live-youtube',
              },
              {
                label: '💬 Discord',
                href: 'https://discord.com/invite/RWQjCRaVJ3',
              },
              {
                label: '🐙 GitHub',
                href: 'https://github.com/roxsross/roxs-devops-project90.git',
              },
              {
                label: '💼 LinkedIn',
                href: 'https://www.linkedin.com/in/roxsross/',
              },
              {
                label: '🐦 Twitter',
                href: 'https://twitter.com/roxsross',
              },
            ],
          },
          {
            title: '🎓 Recursos',
            items: [
              {
                label: '📹 Canal YouTube',
                href: 'https://www.youtube.com/@295devops',
              },
              {
                label: '🌟 295DevOps',
                href: 'https://295devops.com',
              },
              {
                label: '📘 Roadmap DevOps',
                href: 'https://roadmap.sh/devops',
              },
              {
                label: '🔍 DevOps Tools',
                href: 'https://github.com/wmariuss/awesome-devops',
              },
              {
                label: '📊 DevOps Metrics',
                href: 'https://cloud.google.com/architecture/devops/devops-culture-transform',
              },
            ],
          },
        ],
        copyright: `
          <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--ifm-footer-background-color-darker);">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 1.2rem;">🚀</span>
                  <strong>90 Días de DevOps con Roxs</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 1rem;">📅</span>
                  <span>2024-2025</span>
                </div>
              </div>
              <div style="text-align: center; opacity: 0.8; font-size: 0.9rem;">
                Copyright © ${new Date().getFullYear()} 
                <a href="https://www.linkedin.com/in/roxsross/" target="_blank" rel="noopener noreferrer" style="color: var(--ifm-footer-link-color); text-decoration: none; font-weight: 600;"> 
                  Rossana Suarez (@roxsross)
                </a>
              </div>
              <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; justify-content: center; font-size: 0.85rem; opacity: 0.7;">
                <span>🔧 Construido con Docusaurus</span>
                <span>•</span>
                <span>💝 Hecho con amor para la comunidad DevOps</span>
                <span>•</span>
                <span>🌟 Open Source</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                <span style="font-size: 0.8rem; opacity: 0.6;">Síguenos en:</span>
                <a href="https://twitter.com/roxsross" target="_blank" rel="noopener noreferrer" style="color: #1DA1F2; font-size: 1.2rem; text-decoration: none;">🐦</a>
                <a href="https://www.linkedin.com/in/roxsross/" target="_blank" rel="noopener noreferrer" style="color: #0077B5; font-size: 1.2rem; text-decoration: none;">💼</a>
                <a href="https://www.youtube.com/@295devops" target="_blank" rel="noopener noreferrer" style="color: #FF0000; font-size: 1.2rem; text-decoration: none;">📺</a>
                <a href="https://discord.com/invite/RWQjCRaVJ3" target="_blank" rel="noopener noreferrer" style="color: #7289DA; font-size: 1.2rem; text-decoration: none;">💬</a>
                <a href="https://github.com/roxsross/roxs-devops-project90.git" target="_blank" rel="noopener noreferrer" style="color: var(--ifm-footer-link-color); font-size: 1.2rem; text-decoration: none;">🐙</a>
              </div>
            </div>
          </div>
        `,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      mermaid: {
        theme: {
          light: 'neutral',
          dark: 'dark',
        },
        options: {
          fontFamily: 'var(--ifm-font-family-base)',
          theme: 'neutral',
          themeVariables: {
            primaryColor: '#2e8555',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#2e8555',
            lineColor: '#2e8555',
            secondaryColor: '#f9f9f9',
            tertiaryColor: '#fff'
          }
        },
      },
    }),
};

export default config;
