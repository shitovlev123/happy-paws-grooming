import { ChatCircleDots, PaperPlaneTilt, Sparkle, X } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

type ChatMessage = {
  role: 'assistant' | 'user'
  content: string
}

const firstMessage: ChatMessage = {
  role: 'assistant',
  content: 'Здравствуйте! Помогу выбрать уход, сориентировать по записи и подготовке питомца к визиту.',
}

export const AssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([firstMessage])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const openChat = () => {
    setIsOpen(true)
    window.setTimeout(() => inputRef.current?.focus(), 80)
  }

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault()
    const text = input.trim()

    if (!text || isSending) {
      return
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setIsSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          messages: nextMessages,
        }),
      })
      const data = (await response.json().catch(() => null)) as { ok?: boolean; text?: string; error?: string } | null

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Chat request failed')
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.text || firstMessage.content }])
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: 'Сейчас не получилось ответить. Заявку можно оставить в форме, администратор увидит её в Telegram.',
        },
      ])
    } finally {
      setIsSending(false)
    }
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
              <span>Ответит про уход и запись</span>
            </div>
            <button type="button" aria-label="Закрыть чат" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="assistant-messages" aria-live="polite">
            {messages.map((message, index) => (
              <p className={`assistant-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.content}
              </p>
            ))}
            {isSending ? <p className="assistant-message assistant">Печатаю короткий ответ...</p> : null}
          </div>

          <form className="assistant-form" onSubmit={sendMessage}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Спросить про уход"
              aria-label="Сообщение помощнику"
            />
            <button type="submit" aria-label="Отправить сообщение" disabled={isSending || !input.trim()}>
              <PaperPlaneTilt size={20} weight="duotone" />
            </button>
          </form>
        </div>
      ) : (
        <button className="assistant-toggle" type="button" onClick={openChat} aria-label="Открыть AI-консультанта">
          <ChatCircleDots size={26} weight="duotone" />
          <span>Спросить</span>
        </button>
      )}
    </aside>
  )
}
