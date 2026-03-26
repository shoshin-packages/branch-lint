import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { execSync } from 'node:child_process'

/**
 * Тесты для branch-lint CLI
 * 
 * Поскольку основная логика находится в index.js и выполняется при импорте,
 * мы тестируем CLI через выполнение команды
 */

describe('branch-lint CLI', () => {
  const CLI_PATH = './index.js'
  
  // Сохраняем оригинальные env vars
  let originalEnv
  
  beforeEach(() => {
    originalEnv = { ...process.env }
  })
  
  afterEach(() => {
    process.env = originalEnv
  })

  describe('Валидация имён веток', () => {
    it('должен принимать ветку "dev"', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'dev' },
          stdio: 'pipe'
        })
      }).not.toThrow()
    })

    it('должен принимать ветку "main"', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'main' },
          stdio: 'pipe'
        })
      }).not.toThrow()
    })

    it('должен принимать ветку "master"', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'master' },
          stdio: 'pipe'
        })
      }).not.toThrow()
    })

    it('должен принимать feature ветку с типом и описанием', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'feat/add-user-auth' },
          stdio: 'pipe'
        })
      }).not.toThrow()
    })

    it('должен принимать feature ветку с ID задачи', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'fix/FR-123-login-bug' },
          stdio: 'pipe'
        })
      }).not.toThrow()
    })

    it('должен принимать все допустимые типы веток', () => {
      const validTypes = [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'revert',
        'ci',
        'build'
      ]

      validTypes.forEach(type => {
        expect(() => {
          execSync(`node ${CLI_PATH}`, {
            env: { ...process.env, GITHUB_HEAD_REF: `${type}/test-branch` },
            stdio: 'pipe'
          })
        }, `Тип "${type}" должен быть принят`).not.toThrow()
      })
    })

    it('должен отклонять ветку с заглавными буквами в описании', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'feat/AddUserAuth' },
          stdio: 'pipe'
        })
      }).toThrow()
    })

    it('должен отклонять ветку с неверным типом', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'invalid/test-branch' },
          stdio: 'pipe'
        })
      }).toThrow()
    })

    it('должен отклонять ветку без типа', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'just-a-branch' },
          stdio: 'pipe'
        })
      }).toThrow()
    })

    it('должен отклонять ветку с пробелами', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'feat/test branch' },
          stdio: 'pipe'
        })
      }).toThrow()
    })

    it('должен отклонять ветку с подчёркиваниями вместо дефисов', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'feat/test_branch' },
          stdio: 'pipe'
        })
      }).toThrow()
    })

    it('должен принимать ID задачи с цифрами', () => {
      expect(() => {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'feat/AB-12345-description' },
          stdio: 'pipe'
        })
      }).not.toThrow()
    })
  })

  describe('CI окружение', () => {
    it('должен работать в GitHub Actions через GITHUB_HEAD_REF', () => {
      const output = execSync(`node ${CLI_PATH}`, {
        env: {
          ...process.env,
          GITHUB_ACTIONS: 'true',
          GITHUB_HEAD_REF: 'feat/test-feature'
        },
        encoding: 'utf-8'
      })

      expect(output).toContain('соответствует правилам именования')
    })

    it('должен работать в GitHub Actions через GITHUB_REF_NAME', () => {
      const output = execSync(`node ${CLI_PATH}`, {
        env: {
          ...process.env,
          GITHUB_ACTIONS: 'true',
          GITHUB_REF_NAME: 'dev'
        },
        encoding: 'utf-8'
      })

      expect(output).toContain('соответствует правилам именования')
    })

    it('должен пропускать проверку для тегов', () => {
      const output = execSync(`node ${CLI_PATH}`, {
        env: {
          ...process.env,
          GITHUB_REF_TYPE: 'tag'
        },
        encoding: 'utf-8'
      })

      expect(output).toContain('Проверка пропущена (тег)')
    })

    it('должен пропускать проверку для GitLab тегов', () => {
      const output = execSync(`node ${CLI_PATH}`, {
        env: {
          ...process.env,
          CI_COMMIT_TAG: 'v1.0.0'
        },
        encoding: 'utf-8'
      })

      expect(output).toContain('Проверка пропущена (тег)')
    })
  })

  describe('Сообщения об ошибках', () => {
    it('должен выдавать понятное сообщение для неверной ветки', () => {
      try {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'wrong-branch-name' },
          stdio: 'pipe',
          encoding: 'utf-8'
        })
      } catch (error) {
        expect(error.stderr || error.stdout).toContain('Некорректное название ветки')
        expect(error.stderr || error.stdout).toContain('wrong-branch-name')
      }
    })

    it('должен показывать примеры корректных имён', () => {
      try {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'bad-name' },
          stdio: 'pipe',
          encoding: 'utf-8'
        })
      } catch (error) {
        const output = error.stderr || error.stdout
        expect(output).toContain('feat/FR-303-add-user-authentication')
        expect(output).toContain('fix/FR-10-login-issue')
      }
    })
  })

  describe('Exit codes', () => {
    it('должен возвращать 0 для корректной ветки', () => {
      const result = execSync(`node ${CLI_PATH}`, {
        env: { ...process.env, GITHUB_HEAD_REF: 'feat/test' },
        stdio: 'pipe'
      })
      
      expect(result).toBeDefined()
    })

    it('должен возвращать 1 для некорректной ветки', () => {
      try {
        execSync(`node ${CLI_PATH}`, {
          env: { ...process.env, GITHUB_HEAD_REF: 'bad-name' },
          stdio: 'pipe'
        })
        expect.fail('Должен был выбросить ошибку')
      } catch (error) {
        expect(error.status).toBe(1)
      }
    })
  })
})
