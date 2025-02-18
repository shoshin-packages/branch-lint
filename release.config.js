/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [
    'master',
    {
      name: 'dev',
      prerelease: 'beta'
    }
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'revert', release: 'patch' },
          { type: 'style', release: false },
          { type: 'docs', release: false },
          { type: 'chore', release: false },
          { type: 'test', release: false },
          { type: 'ci', release: false },
          { type: 'build', release: false }
        ]
      }
    ],
    '@templates/semantic-release-mattermost',
    '@semantic-release/npm',
    ['@semantic-release/git', {
      assets: ['package.json'],
      message: 'chore: ${nextRelease.version} [skip ci]'
    }],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            {
              type: 'feat',
              section: '🚀 Фичи',
              hidden: false
            },
            {
              type: 'fix',
              section: '🩹 Баг-фиксы',
              hidden: false
            },
            {
              type: 'refactor',
              section: '💅 Рефакторинг',
              hidden: false
            },
            {
              type: 'perf',
              section: '🔥 Производительность',
              hidden: false
            },
            {
              type: 'revert',
              section: '⏪ Откат изменений',
              hidden: false
            },
            {
              type: 'ci',
              section: '🤖 CI',
              hidden: false
            },
            {
              type: 'style',
              section: '🎨 Стили',
              hidden: false
            },
            {
              type: 'test',
              section: '🧪 Тесты',
              hidden: false
            },
            {
              type: 'docs',
              section: '📖 Документация',
              hidden: false
            },
            {
              type: 'chore',
              section: '🏡 Остальное',
              hidden: false
            },
            {
              type: 'build',
              section: '📦 Сборка',
              hidden: false
            }
          ]
        }
      }
    ]
  ],
  publishConfig: {
    access: 'public'
  }
}
