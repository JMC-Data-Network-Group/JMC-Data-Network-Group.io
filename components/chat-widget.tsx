'use client'

import { useState, type FormEvent } from 'react'
import {
  Bot,
  MessageCircle,
  Send,
  X,
  Minus,
} from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! 👋 Bienvenido. ¿En qué podemos ayudarte?',
      sender: 'bot',
    },
  ])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmedMessage,
        sender: 'user',
      },
    ])

    setMessage('')

    // TODO: Aquí puedes agregar la lógica para enviar el mensaje al bot y recibir una respuesta
  }

  return (
    <div className="chat-widget">
      {/* Ventana del chat */}
      {isOpen && (
        <section
          className="chat-window"
          aria-label="Chat de asistencia"
        >
          {/* Encabezado */}
          <header className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <Bot size={23} />
              </div>

              <div>
                <h3>Asistente virtual</h3>
                <span className="chat-status">
                  <span className="chat-status-dot" />
                  En línea
                </span>
              </div>
            </div>

            <button
              type="button"
              className="chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
            >
              <Minus size={20} />
            </button>
          </header>

          {/* Mensajes */}
          <div className="chat-messages">
            <div className="chat-date">
              Conversación
            </div>

            {messages.map((item) => (
              <div
                key={item.id}
                className={`chat-message ${
                  item.sender === 'user'
                    ? 'chat-message-user'
                    : 'chat-message-bot'
                }`}
              >
                {item.sender === 'bot' && (
                  <div className="chat-message-avatar">
                    <Bot size={15} />
                  </div>
                )}

                <div className="chat-message-content">
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          {/* Campo de escritura */}
          <form
            className="chat-input-container"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              aria-label="Escribe tu mensaje"
            />

            <button
              type="submit"
              disabled={!message.trim()}
              aria-label="Enviar mensaje"
            >
              <Send size={18} />
            </button>
          </form>

          <div className="chat-footer">
            Atención al cliente
          </div>
        </section>
      )}

      {/* Botón flotante */}
      <button
        type="button"
        className={`chat-toggle ${isOpen ? 'chat-toggle-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={25} />
        ) : (
          <>
            <MessageCircle size={26} />
            <span className="chat-notification" />
          </>
        )}
      </button>
    </div>
  )
}