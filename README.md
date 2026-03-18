# @shoshin-packages/branch-lint

CLI-утилита для проверки соответствия имени текущей git-ветки принятому формату именования.

Работает в двух режимах: **локально** (pre-push хук) и **в CI-пайплайне** (защита от обхода хука через `--no-verify`).

## Как работает

```
branch-lint
    │
    ├─ Это тег? (GITHUB_REF_TYPE=tag / CI_COMMIT_TAG)
    │       └─ ДА → ✅ пропустить (теги создаёт semantic-release)
    │
    ├─ Локальный запуск: это git-репозиторий?
    │       └─ НЕТ → ❌ ошибка
    │
    ├─ Получить имя ветки
    │       ├─ CI: из переменных окружения (GITHUB_HEAD_REF / GITHUB_REF_NAME / CI_COMMIT_BRANCH)
    │       └─ Локально: git rev-parse --abbrev-ref HEAD
    │
    └─ Проверить по правилам
            ├─ ДА → ✅ успех
            └─ НЕТ → ❌ ошибка с подсказкой
```

## Поддерживаемые окружения

| Окружение | Источник имени ветки |
|---|---|
| GitHub Actions (push) | `GITHUB_REF_NAME` |
| GitHub Actions (pull request) | `GITHUB_HEAD_REF` |
| GitLab CI | `CI_COMMIT_BRANCH` |
| Локально | `git rev-parse --abbrev-ref HEAD` |

## Допустимые форматы веток

### Основные ветки
```
dev
main
master
```

### Рабочие ветки
```
(тип)/(идентификатор задачи)-(описание)
(тип)/(описание)
```

**Допустимые типы:**

| Тип | Назначение |
|---|---|
| `feat` | Новая функциональность |
| `fix` | Исправление бага |
| `docs` | Документация |
| `style` | Форматирование, стили |
| `refactor` | Рефакторинг |
| `test` | Тесты |
| `chore` | Обслуживание, зависимости |
| `perf` | Производительность |
| `revert` | Откат изменений |
| `ci` | CI/CD |
| `build` | Сборка |

**Примеры:**
```bash
feat/FR-303-add-user-authentication  # ✅ с ID задачи
fix/FR-10-login-issue                # ✅ с ID задачи
refactor/code-refactoring            # ✅ без ID задачи
my_feature                           # ❌ нет типа, underscore недопустим
```

**Формат ID задачи:** `[A-Z]{2}-[0-9]+` — две заглавные буквы, дефис, номер. Например: `FR-303`, `AB-12`.

## Установка

Добавьте в `.npmrc` проекта:
```
@shoshin-packages:registry=https://npm.pkg.github.com
```

Установите пакет:
```bash
npm i @shoshin-packages/branch-lint --save-dev
```

## Использование

### 1. Локально — pre-push хук (рекомендуется)

С [husky](https://github.com/typicode/husky):
```bash
npm i husky --save-dev
npx husky init
echo "branch-lint" > .husky/pre-push
```

Теперь при каждом `git push` утилита автоматически проверяет имя ветки.

### 2. В CI-пайплайне — защита от `--no-verify`

Добавьте шаг в GitHub Actions:
```yaml
- name: Lint branch name
  run: npx branch-lint
```

Или в GitLab CI:
```yaml
lint-branch:
  stage: lint
  script:
    - npx branch-lint
```

Утилита автоматически определяет окружение и берёт имя ветки из переменных CI.

## Требования

- Node.js `>=22`
- npm `>=10`
- git (только для локального запуска)
