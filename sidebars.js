/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Sidebar principal con estructura optimizada
  tutorialSidebar: [
    // Páginas principales
    {
      type: 'doc',
      id: 'programa',
      label: '🏠 Bienvenidos al Reto DevOps',
    },
    {
      type: 'doc',
      id: 'calendario',
      label: '📅 Calendario de Encuentros',
    },
    {
      type: 'doc',
      id: 'plan-de-estudio',
      label: '📋 Plan de Estudio',
    },
    {
      type: 'doc',
      id: 'proyect-fuego',
      label: '🔥 Proyecto Fuego by Roxs',
    },
    {
      type: 'doc',
      id: 'devops',
      label: '🚀 Sobre DevOps',
    },
    {
      type: 'doc',
      id: 'roadmap',
      label: '🗺️ Roadmap DevOps',
    },
    
    // Comunidad
    {
      type: 'category',
      label: '🎥 Comunidad',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'live-youtube',
          label: '📺 DevOps Live YouTube',
        },
      ],
    },
    
    // Programa de Estudio
    {
      type: 'category',
      label: '📚 Programa de Estudio',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: '1️⃣ Semana 1',
          collapsed: true,
          items: [
            'semana-01/dia1',
            'semana-01/dia2',
            'semana-01/dia3',
            'semana-01/dia4',
            'semana-01/dia5',
            'semana-01/dia6',
            'semana-01/dia7',
          ],
        },
        {
          type: 'category',
          label: '2️⃣ Semana 2',
          collapsed: true,
          items: [
            'semana-02/dia8',
            'semana-02/dia9',
            'semana-02/dia10',
            'semana-02/dia11',
            'semana-02/dia12',
            'semana-02/dia13',
            'semana-02/dia14',
          ],
        },
        {
          type: 'category',
          label: '3️⃣ Semana 3',
          collapsed: true,
          items: [
            'semana-03/dia15',
            'semana-03/dia16',
            'semana-03/dia17',
            'semana-03/dia18',
            'semana-03/dia19',
            'semana-03/dia20',
            'semana-03/dia21',
          ],
        },
        {
          type: 'category',
          label: '4️⃣ Semana 4',
          collapsed: true,
          items: [
            'semana-04/dia22',
            'semana-04/dia23',
            'semana-04/dia24',
            'semana-04/dia25',
            'semana-04/dia26',
            'semana-04/dia27',
            'semana-04/dia28',
          ],
        },
        {
          type: 'category',
          label: '5️⃣ Semana 5',
          collapsed: true,
          items: [
            'semana-05/dia29',
            'semana-05/dia30',
            'semana-05/dia31',
            'semana-05/dia32',
            'semana-05/dia33',
            'semana-05/dia34',
            'semana-05/dia35',
          ],
        },
        {
          type: 'category',
          label: '6️⃣ Semana 6',
          collapsed: true,
          items: [
            'semana-06/dia36',
            'semana-06/dia37',
            'semana-06/dia38',
            'semana-06/dia39',
            'semana-06/dia40',
            'semana-06/dia41',
            'semana-06/dia42',
          ],
        },
        {
          type: 'category',
          label: '7️⃣ Semana 7',
          collapsed: true,
          items: [
            'semana-07/dia43',
            'semana-07/dia44',
            'semana-07/dia45',
            'semana-07/dia46',
            'semana-07/dia47',
            'semana-07/dia48',
            'semana-07/dia49',
          ],
        },
        {
          type: 'category',
          label: '8️⃣ Semana 8',
          collapsed: true,
          items: [
            'semana-08/dia50',
            'semana-08/dia51',
            'semana-08/dia52',
            'semana-08/dia53',
            'semana-08/dia54',
            'semana-08/dia55',
            'semana-08/dia56',
          ],
        },
        {
          type: 'category',
          label: '9️⃣ Semana 9',
          collapsed: true,
          items: [
            'semana-09/dia57',
            'semana-09/dia58',
            'semana-09/dia59',
            'semana-09/dia60',
            'semana-09/dia61',
            'semana-09/dia62',
            'semana-09/dia63',
          ],
        },
        {
          type: 'category',
          label: '1️⃣0️⃣ Semana 10',
          collapsed: true,
          items: [
            'semana-10/dia64',
            'semana-10/dia65',
            'semana-10/dia66',
            'semana-10/dia67',
            'semana-10/dia68',
            'semana-10/dia69',
            'semana-10/dia70',
          ],
        },
      ],
    },
    
    // Recursos
    {
      type: 'category',
      label: '🛠️ Recursos',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: '📍 DevOps Projects',
          collapsed: true,
          items: [
            'DevOps-Projects/project0',
            'DevOps-Projects/project1',
          ],
        },
        {
          type: 'category',
          label: '⚙️ DevOps Tools',
          collapsed: true,
          items: [
            'DevOps-Tools/tools',
            'DevOps-Tools/vsc',
            'DevOps-Tools/playgrounds',
            {
              type: 'category',
              label: '🐧 Linux CLI',
              collapsed: true,
              items: [
                {type: 'autogenerated', dirName: 'DevOps-Tools/linux-cli'},
              ],
            },
            {
              type: 'category',
              label: '📝 Uso de Bash',
              collapsed: true,
              items: [
                {type: 'autogenerated', dirName: 'DevOps-Tools/uso-bash'},
              ],
            },
            {
              type: 'category',
              label: '💡 Ejemplos Linux',
              collapsed: true,
              items: [
                {type: 'autogenerated', dirName: 'DevOps-Tools/ejemplos-linux'},
              ],
            },
          ],
        },
        {
          type: 'category',
          label: '📚 Libros DevOps',
          collapsed: true,
          items: [
            'Libros/libros-devops-1',
            'Libros/libros-devops-2',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
