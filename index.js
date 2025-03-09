#!/usr/bin/env node
import { execSync } from 'node:child_process'

function isInCIEnvironment() {
  return Boolean(
    process.env.CI ||
    process.env.GITLAB_CI ||
    process.env.JENKINS_URL ||
    process.env.GITHUB_ACTIONS
  )
}

function isGitRepo() {
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      stdio: 'ignore'
    })

    return true
  } catch (error) {
    return false
  }
}

function isValidBranchName(branchName) {
  const featureBranchRegex = /^(feat|fix|docs|style|refactor|test|chore|perf|revert|ci|build)\/([A-Z]{2}-[0-9]+-)?[a-z0-9-]+$/
  const mainBranches = [
    'dev',
    'main',
    'master'
  ]

  return mainBranches.includes(branchName) || featureBranchRegex.test(branchName)
}

function exitWithSuccess(message) {
  console.info(message)

  process.exit(0)
}

function exitWithError(message) {
  console.error(message)

  process.exit(1)
}


function checkBranchName() {
  if (!isGitRepo()) {
    exitWithError(' ❌ Текущая директория не является GIT-репозиторием')
  }

  if (isInCIEnvironment()) {
    exitWithSuccess(' ✅ Проверка пропущена (CI-окружение)')
    return
  }

  let localBranchName
  try {
    localBranchName = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim()
  } catch (error) {
    exitWithError(' ❌ Не удалось получить имя текущей ветки')
  }

  if (!isValidBranchName(localBranchName)) {
    exitWithError(`
---------
 ❌ Некорректное название ветки
Название ветки в этом проекте должно соответствовать этому формату:
(тип)/(идентификатор задачи)-(описание)
  - feat/FR-303-add-user-authentication
  - fix/FR-10-login-issue
  - refactor/code-refactoring

Также допустимые ветки
  - dev
  - main
  - master

 🔄 Переименуйте ветку и повторите попытку
---------
`
    )
  }

  exitWithSuccess(` ✅ Ветка "${localBranchName}" соответствует правилам именования`)
}


checkBranchName()
