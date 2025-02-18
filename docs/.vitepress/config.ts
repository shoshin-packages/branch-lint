import { defineConfig } from 'vitepress'


export default defineConfig({
  lang: 'ru',
  title: '@frontend/branch-lint',
  base: '/tools/branch-lint/',
  outDir: '../public',
  description: 'CLI-утилита проверяющий соответствие имени ветки формату описанного в спецификации',

  themeConfig: {
    aside: false,

    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><g fill="none" fill-rule="nonzero"><path fill="#E24329" d="m19.667 7.624-.028-.072L16.917.448a.71.71 0 0 0-.28-.337.729.729 0 0 0-.834.044.729.729 0 0 0-.241.367l-1.838 5.623H6.28L4.443.522a.714.714 0 0 0-.241-.368.715.715 0 0 0-1.113.293L.36 7.547l-.027.073a5.055 5.055 0 0 0 1.677 5.842l.01.007.024.018 4.147 3.105 2.051 1.553 1.25.943a.84.84 0 0 0 1.016 0l1.25-.943 2.051-1.553 4.172-3.124.01-.008a5.057 5.057 0 0 0 1.675-5.836Z"/><path fill="#FC6D26" d="m19.667 7.624-.028-.072a9.195 9.195 0 0 0-3.66 1.645L10 13.717l3.808 2.88 4.172-3.125.01-.008a5.057 5.057 0 0 0 1.677-5.84Z"/><path fill="#FCA326" d="m6.192 16.596 2.051 1.553 1.25.943a.84.84 0 0 0 1.016 0l1.25-.943 2.051-1.553s-1.774-1.342-3.81-2.878c-2.036 1.536-3.808 2.878-3.808 2.878Z"/><path fill="#FC6D26" d="M4.02 9.197a9.184 9.184 0 0 0-3.659-1.65l-.027.073a5.055 5.055 0 0 0 1.677 5.842l.01.007.024.018 4.147 3.105L10 13.714 4.02 9.197Z"/></g></svg>'
        },
        link: 'https://gitlab.localtrip.ru/frontend/tools/branch-lint/'
      }
    ],

    nav: [
      {
        text: 'Экосистема',
        items: [
          {
            text: 'UI',
            items: [
              {
                text: '/ui',
                link: 'https://frontend.localtrip.ru/ui/ui'
              },
              {
                text: '/icons',
                link: 'https://frontend.localtrip.ru/ui/icons'
              },
              {
                text: '/variables',
                link: 'https://frontend.localtrip.ru/ui/variables'
              }
            ]
          },
          {
            text: 'Shared',
            items: [
              {
                text: '/eslint-config',
                activeMatch: '/',
                link: '#'
              }
            ]
          }
        ]
      },
      {
        text: 'Изменения',
        link: 'https://chat.localtrip.ru/locatrip/channels/frontend-release'
      }
    ]
  }
})
