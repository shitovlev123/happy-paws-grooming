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
  content: 'Здравствуйте! Я здесь чтобы помочь вам 😊. Используйте заготовленные вопросы или задайте свой.',
}

const quickPrompts = ['Подобрать услугу', 'Как подготовиться', 'Свободное время']
const announcementDelayMs = 2400
const announcementHideMs = 12000
const announcementText = 'Не знаете, какую услугу выбрать? Спросите ИИ-консультанта.'

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const AssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([firstMessage])
  const [suggestions, setSuggestions] = useState<string[]>(quickPrompts)
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      setIsAnnouncementVisible(true)
    }, announcementDelayMs)
    const hideTimer = window.setTimeout(() => {
      setIsAnnouncementVisible(false)
    }, announcementHideMs)

    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isSending])

  const openChat = () => {
    setIsAnnouncementVisible(false)
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
        <>
          {isAnnouncementVisible ? (
            <div className="assistant-announcement" role="status" aria-live="polite">
              {announcementText}
            </div>
          ) : null}
          <button className="assistant-toggle" type="button" onClick={openChat} aria-label="Открыть AI-консультанта">
            <span className="assistant-toggle-icon">
              <ChatCircleDots size={25} weight="duotone" />
            </span>
            <strong>Задайте вопрос</strong>
          </button>
        </>
      )}
    </aside>
  )
}
