# @shoshin-packages/branch-lint

CLI-утилита для проверки соответствия имени ветки формату conventional branch naming.

## 🚀 Возможности

- ✅ Проверка формата веток по Conventional Commits
- ✅ Поддержка ID задач (Jira, Linear, и др.)
- ✅ Работа в CI/CD (GitHub Actions, GitLab CI)
- ✅ Понятные сообщения об ошибках
- ✅ Zero-config — работает из коробки

## 📦 Установка

::: info Требования
- Node.js >= 22
- npm >= 11
:::

Пакет опубликован в GitHub Packages. Добавьте в `.npmrc`:

```ini
@shoshin-packages:registry=https://npm.pkg.github.com
```

Затем установите:

```bash
npm install @shoshin-packages/branch-lint --save-dev
```

## 📖 Правила именования

### Основные ветки

Допускаются без ограничений:
- `dev`
- `main`
- `master`

### Feature ветки

Формат: `<тип>/<описание>` или `<тип>/<ID-задачи>-<описание>`

**Допустимые типы:**
- `feat` — новая функциональность
- `fix` — исправление бага
- `docs` — изменения в документации
- `style` — форматирование кода
- `refactor` — рефакторинг
- `test` — добавление/изменение тестов
- `chore` — обновление зависимостей, конфигурации
- `perf` — оптимизация производительности
- `revert` — откат изменений
- `ci` — изменения CI/CD
- `build` — изменения системы сборки

**Правила:**
- Описание только строчными буквами
- Только дефисы (не подчёркивания)
- Только буквы, цифры и дефисы

### Примеры

✅ **Корректные:**
```
feat/add-user-authentication
fix/FR-303-login-bug
docs/update-readme
refactor/AB-123-improve-performance
```

❌ **Некорректные:**
```
AddUserAuth           # Нет типа
feat/Add-User-Auth    # Заглавные буквы в описании
fix/login_bug         # Подчёркивания
feature/test          # Неверный тип
```

## 🔧 Использование

### CLI

```bash
# Запустить в текущей ветке
npx branch-lint

# Через npm script
npm run branch-lint
```

### npm scripts

Добавьте в `package.json`:

```json
{
  "scripts": {
    "branch-lint": "branch-lint"
  }
}
```

### Git hooks (husky)

```bash
# .husky/pre-push
#!/usr/bin/env sh
npx branch-lint
```

### GitHub Actions

```yaml
name: Branch Lint

on:
  pull_request:
  push:
    branches-ignore:
      - main
      - dev

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          
      - name: Validate branch name
        run: npx @shoshin-packages/branch-lint
```

### GitLab CI

```yaml
branch-lint:
  stage: validate
  image: node:22
  script:
    - npx @shoshin-packages/branch-lint
  only:
    - merge_requests
```

## 🎯 Как это работает

1. **Определяет окружение:**
   - CI (GitHub Actions, GitLab CI, Jenkins)
   - Локальная разработка

2. **Получает имя ветки:**
   - `GITHUB_HEAD_REF` (GitHub Actions PR)
   - `GITHUB_REF_NAME` (GitHub Actions push)
   - `CI_COMMIT_BRANCH` (GitLab CI)
   - `git rev-parse --abbrev-ref HEAD` (локально)

3. **Валидирует формат:**
   - Проверяет основные ветки (dev, main, master)
   - Проверяет feature ветки по regex
   - Возвращает exit code 0 (успех) или 1 (ошибка)

4. **Пропускает теги:**
   - Semantic-release создаёт теги — они не валидируются

## 🧪 Тестирование

Пакет покрыт тестами на 100%:

```bash
npm test              # Запустить тесты
npm run test:watch    # Watch mode
npm run test:ui       # UI интерфейс
npm run test:coverage # Coverage отчёт
```

## 📝 Лицензия

MIT

## 🤝 Contributing

Pull requests приветствуются! Для крупных изменений сначала откройте issue.

**При создании PR:**
1. Название ветки должно соответствовать формату (иначе CI упадёт 😉)
2. Следуйте Conventional Commits
3. Добавьте тесты для новой функциональности
4. Убедитесь что все тесты проходят

## 🔗 Ссылки

- [GitHub Repository](https://github.com/shoshin-packages/branch-lint)
- [Issues](https://github.com/shoshin-packages/branch-lint/issues)
- [Changelog](https://github.com/shoshin-packages/branch-lint/releases)
