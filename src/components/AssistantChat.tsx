import { ChatCircleDots, Heart, PaperPlaneTilt, Sparkle, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

type ChatMessage = {
  role: 'assistant' | 'user'
  content: string
}

type ChatResponse = {
  ok?: boolean
  text?: string
  suggestions?: string[]
  error?: string
}

const firstMessage: ChatMessage = {
  role: 'assistant',
  content: 'Здравствуйте! Я помогу выбрать уход, подготовиться к визиту и быстро перейти к записи.',
}

const quickPrompts = ['Подобрать услугу', 'Как подготовиться', 'Свободное время']
const handwritingReplayMs = 14000

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const HandWritingLabel = ({ cycle }: { cycle: number }) => (
  <span className="assistant-handwriting" aria-hidden="true" key={cycle}>
    <svg viewBox="0 0 184 32" role="img">
      <text x="2" y="23">
        ИИ-помощник
      </text>
    </svg>
  </span>
)

export const AssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([firstMessage])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [handwritingCycle, setHandwritingCycle] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHandwritingCycle((cycle) => cycle + 1)
    }, handwritingReplayMs)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isSending])

  const openChat = () => {
    setIsOpen(true)
    window.setTimeout(() => inputRef.current?.focus(), 80)
  }

  const sendText = async (text: string) => {
    const message = text.trim()

    if (!message || isSending) {
      return
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: message }]
    setMessages(nextMessages)
    setInput('')
    setIsSending(true)

    try {
      const [response] = await Promise.all([
        fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            messages: nextMessages,
          }),
        }),
        wait(520),
      ])
      const data = (await response.json().catch(() => null)) as ChatResponse | null

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Chat request failed')
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.text || firstMessage.content }])
      setSuggestions(data.suggestions?.length ? data.suggestions.slice(0, 3) : quickPrompts)
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: 'Сейчас не получилось ответить. Заявку можно оставить в форме, администратор увидит её в Telegram.',
        },
      ])
      setSuggestions(['Перейти к записи', 'Контакты салона', 'Выбрать услугу'])
    } finally {
      setIsSending(false)
    }
  }

  const sendMessage = (event: FormEvent) => {
    event.preventDefault()
    void sendText(input)
  }

  return (
    <aside className={`assistant-chat ${isOpen ? 'is-open' : ''}`} aria-label="AI-консультант">
      {isOpen ? (
        <div className="assistant-panel">
          <div className="assistant-head">
            <span className="assistant-mark">
              <Sparkle size={18} weight="duotone" />
            </span>
            <div>
              <strong>Помощник салона</strong>
              <span>Подскажет уход и запись</span>
            </div>
            <button type="button" aria-label="Закрыть чат" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="assistant-messages" aria-live="polite" ref={messagesRef}>
            {messages.map((message, index) => (
              <div className={`assistant-message ${message.role}`} key={`${message.role}-${index}`}>
                <span className="assistant-avatar" aria-hidden="true">
                  {message.role === 'assistant' ? <Sparkle size={15} weight="duotone" /> : <Heart size={15} weight="duotone" />}
                </span>
                <p>{message.content}</p>
              </div>
            ))}
            {isSending ? (
              <div className="assistant-message assistant is-typing">
                <span className="assistant-avatar" aria-hidden="true">
                  <Sparkle size={15} weight="duotone" />
                </span>
                <p>
                  <span />
                  <span />
                  <span />
                </p>
              </div>
            ) : null}
          </div>

          {suggestions.length > 0 ? (
            <div className="assistant-suggestions" aria-label="Быстрые вопросы">
              {suggestions.map((suggestion) => (
                <button type="button" onClick={() => void sendText(suggestion)} disabled={isSending} key={suggestion}>
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}

          <form className="assistant-form" onSubmit={sendMessage}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Задайте свой вопрос"
              aria-label="Сообщение помощнику"
            />
            <button type="submit" aria-label="Отправить сообщение" disabled={isSending || !input.trim()}>
              <PaperPlaneTilt size={20} weight="duotone" />
            </button>
          </form>
        </div>
      ) : (
        <button className="assistant-toggle" type="button" onClick={openChat} aria-label="Открыть AI-консультанта">
          <span className="assistant-toggle-icon">
            <ChatCircleDots size={25} weight="duotone" />
          </span>
          <span className="assistant-toggle-copy">
            <strong className="sr-only">ИИ-помощник</strong>
            <HandWritingLabel cycle={handwritingCycle} />
            <small>задайте вопрос</small>
          </span>
        </button>
      )}
    </aside>
  )
}
