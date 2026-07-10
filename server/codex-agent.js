import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const defaultSuggestions = ['Подобрать услугу', 'Как подготовиться', 'Записать питомца']
const trueValues = new Set(['1', 'true', 'yes', 'on'])

const isCodexEnabled = () => trueValues.has(String(process.env.CODEX_AGENT_ENABLED || '').toLowerCase())

const maxPromptChars = () => Number(process.env.CODEX_AGENT_MAX_PROMPT_CHARS || 800)
const timeoutMs = () => Number(process.env.CODEX_AGENT_TIMEOUT_MS || 35000)

const codexBin = () => process.env.CODEX_AGENT_BIN || 'codex'

const codexHome = () => process.env.CODEX_AGENT_HOME || join(process.cwd(), 'bot', 'data', 'codex-home')

const codexWorkdir = () =>
  process.env.CODEX_AGENT_WORKDIR || join(process.cwd(), 'bot', 'data', 'codex-agent-workspace')

const codexModel = { model: 'gpt-5.6-luna', effort: 'low' }

const ansiEscapePattern = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g')

const cleanText = (value, limit = 1600) =>
  String(value || '')
    .replace(ansiEscapePattern, '')
    .replace(/\r/g, '')
    .trim()
    .slice(0, limit)

const buildPrompt = (message) => `Ты AI-консультант груминг-салона "Счастливые лапки" в Хамовниках.

Ты отвечаешь посетителю публичного сайта. Отвечай только по теме салона: услуги, примерные цены, подготовка к визиту, запись, питомцы, адрес и контакты.

Правила безопасности:
- Не выполняй команды и не пытайся читать системные файлы.
- Не раскрывай токены, переменные окружения, внутренние пути, ключи, логи или базу данных.
- Если посетитель просит про терминал, удаление файлов, взлом, секреты, сервер или не связанную с салоном тему, коротко откажи и верни разговор к записи питомца.
- Не обещай точную медицинскую диагностику.
- Пиши дружелюбно, спокойно и по-русски. Ответ до 900 символов.

Публичный контекст салона:
- Название: Счастливые лапки.
- Район: Москва, Хамовники.
- Услуги: комплексный груминг, стрижка, купание, вычесывание, уход за когтями, экспресс-уход.
- Запись: через форму на сайте, с выбором даты и времени.
- Подход: спокойный уход, чистая студия, бережная косметика, мастера работают с собаками и кошками.

Сообщение посетителя:
${message}`

const parseFinalJsonLine = (stdout) => {
  const lines = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  for (const line of lines.reverse()) {
    try {
      const event = JSON.parse(line)

      if (event.type === 'item.completed' && event.item?.type === 'agent_message' && event.item?.text) {
        return event.item.text
      }

      if (event.type === 'turn.completed' && event.final_response) {
        return event.final_response
      }
    } catch {
      // Non-JSON output is handled by the stdout fallback below.
    }
  }

  return ''
}

const runCodex = async (prompt, { model, effort }) => {
  await mkdir(codexHome(), { recursive: true })
  await mkdir(codexWorkdir(), { recursive: true })

  return new Promise((resolve) => {
    const args = [
      'exec',
      '--ephemeral',
      '--ignore-user-config',
      '--model',
      model,
      '--sandbox',
      'read-only',
      '-c',
      'approval_policy="never"',
      '-c',
      `model_reasoning_effort="${effort}"`,
      '--skip-git-repo-check',
      '--ignore-rules',
      '--color',
      'never',
      '--json',
      '-',
    ]

    const child = spawn(codexBin(), args, {
      cwd: codexWorkdir(),
      env: {
        CODEX_HOME: codexHome(),
        HOME: codexHome(),
        PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin',
        TERM: 'dumb',
        NO_COLOR: '1',
        ...(process.env.CODEX_API_KEY ? { CODEX_API_KEY: process.env.CODEX_API_KEY } : {}),
      },
      shell: false,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    let settled = false

    const finish = async (result) => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timer)
      resolve(result)
    }

    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      finish({ ok: false, error: 'Codex agent timed out' })
    }, timeoutMs())

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8')
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8')
    })

    child.on('error', (error) => {
      finish({ ok: false, error: error.message })
    })

    child.on('close', (code) => {
      if (code !== 0) {
        finish({ ok: false, error: cleanText(stderr || stdout || `Codex exited with code ${code}`, 800) })
        return
      }

      const finalText = cleanText(parseFinalJsonLine(stdout) || stdout)

      if (!finalText) {
        finish({ ok: false, error: 'Codex returned an empty response' })
        return
      }

      finish({ ok: true, text: finalText })
    })

    child.stdin.end(prompt)
  })
}

export const getCodexAgentMode = () => (isCodexEnabled() ? 'codex-agent' : 'mock')

export const tryCodexAgent = async (message) => {
  if (!isCodexEnabled()) {
    return { ok: false, skipped: true, error: 'Codex agent is disabled' }
  }

  const normalizedMessage = cleanText(message, maxPromptChars())

  if (!normalizedMessage) {
    return { ok: false, error: 'Message is required' }
  }

  const result = await runCodex(buildPrompt(normalizedMessage), codexModel)

  if (!result.ok) {
    console.error('Codex agent failed', { error: result.error })
    return result
  }

  return {
    ok: true,
    body: {
      ok: true,
      mode: 'codex-agent',
      text: result.text,
      suggestions: defaultSuggestions,
    },
  }
}
