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

// Теги пропускаем — они создаются semantic-release и не должны проходить проверку
function isTagEvent() {
  return Boolean(
    process.env.GITHUB_REF_TYPE === 'tag' ||
    process.env.CI_COMMIT_TAG
  )
}

function isGitRepo() {
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      stdio: 'ignore'
    })

    return true
  } catch {
    return false
  }
}

function getBranchName() {
  // GitHub Actions: PR (название ветки источника)test
  if (process.env.GITHUB_HEAD_REF) {
    return process.env.GITHUB_HEAD_REF
  }

  // GitHub Actions: push в ветку
  if (process.env.GITHUB_REF_NAME) {
    return process.env.GITHUB_REF_NAME
  }

  // GitLab CI
  if (process.env.CI_COMMIT_BRANCH) {
    return process.env.CI_COMMIT_BRANCH
  }

  // Локально — через git
  return execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim()
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
  if (isTagEvent()) {
    exitWithSuccess(' ✅ Проверка пропущена (тег)')
  }

  if (!isInCIEnvironment() && !isGitRepo()) {
    exitWithError(' ❌ Текущая директория не является GIT-репозиторием')
  }

  let branchName
  try {
    branchName = getBranchName()
  } catch {
    exitWithError(' ❌ Не удалось получить имя текущей ветки')
  }

  if (!isValidBranchName(branchName)) {
    exitWithError(`
---------
 ❌ Некорректное название ветки: "${branchName}"
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

  exitWithSuccess(` ✅ Ветка "${branchName}" соответствует правилам именования`)
}


checkBranchName()
