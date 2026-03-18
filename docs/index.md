# @shoshin-packages/branch-lint
CLI-утилита для проверки соответствия имени ветки формату conventional branch naming.

Допустимые форматы:
- `feat/FR-303-add-user-authentication`
- `fix/FR-10-login-issue`
- `refactor/code-refactoring`
- `dev`, `main`, `master`


## Установка
::: info `.npmrc`
Пакет опубликован в GitHub Packages. Добавьте в `.npmrc`:
```
@shoshin-packages:registry=https://npm.pkg.github.com
```
:::

```bash
npm i @shoshin-packages/branch-lint --save-dev
```


## Использование
```shell
branch-lint
```
