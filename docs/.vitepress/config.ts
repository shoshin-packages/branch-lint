import { defineConfig } from 'vitepress'


export default defineConfig({
  lang: 'ru',
  title: '@shoshin-packages/branch-lint',
  base: '/branch-lint/',
  outDir: '../public',
  description: 'CLI-утилита проверяющий соответствие имени ветки формату описанного в спецификации',

  themeConfig: {
    aside: false,

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/shoshin-packages/branch-lint'
      }
    ],

    nav: [
      {
        text: 'Изменения',
        link: 'https://github.com/shoshin-packages/branch-lint/releases'
      }
    ]
  }
})
