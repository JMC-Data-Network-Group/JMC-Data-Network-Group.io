'use client'

import {useState, type FormEvent} from 'react'
import {
  Bot,
  Send,
  X,
  Minus,
} from 'lucide-react'


const CONFIG = {
  nombre: 'Chirper',
  subtitulo: 'Asistente de JMC Data & Network Group',
  colorPrincipal: '#12324f',
  icono: '/bo.png',
  posicion: 'derecha',
  saludo:
    '¡Hola! 👋 Soy Chirper, el asistente de JMC Data & Network Group. Elige una pregunta y te respondo al momento.',
  textoMasPreguntas: '¿Te ayudo con algo más?',
  retrasoRespuestaMs: 600,
  apareceTrasSegundos: 0,
  avisoPendiente: true,
  preguntas: [
    {
      pregunta: '¿Cómo pueden ayudar a mi negocio?',
      respuesta:
        'Organizamos y conectamos la información de tu empresa para que tomes mejores decisiones:\n\n• Almacenamos tus datos de forma ordenada y siempre disponible.\n• Creamos reportes y tableros para seguir el rendimiento de tu negocio.\n• Conectamos tus fuentes de datos para reducir tareas manuales.\n• Optimizamos tus redes y recursos tecnológicos.',
      enlace: {
        texto: 'Ver servicios',
        url: '#servicios',
      },
    },
    {
      pregunta: '¿Puedo ver un ejemplo?',
      respuesta:
        '¡Claro! En nuestra web tienes un reporte interactivo de ejemplo que puedes filtrar y explorar.',
      enlace: {
        texto: 'Ver el ejemplo',
        url: '#demo',
      },
    },
    {
      pregunta: '¿Cuánto cuesta?',
      respuesta:
        'Depende de lo que necesite tu empresa. Cuéntanos tu caso y te preparamos una propuesta sin compromiso.',
      enlace: {
        texto: 'Pedir una propuesta',
        url: 'mailto:contacto@jmcdatanetworkgroup.com?subject=Solicitud%20de%20propuesta',
      },
    },
    {
      pregunta: '¿Cómo los contacto?',
      respuesta:
        'Escríbenos a contacto@jmcdatanetworkgroup.com y conversemos sobre tu proyecto.',
      enlace: {
        texto: 'Escribir a JMC',
        url: 'mailto:contacto@jmcdatanetworkgroup.com?subject=Consulta%20desde%20la%20web',
      },
    },
  ],

  respuestaPredeterminada:
    'Gracias por comunicarte con JMC Data & Network Group. No tengo una respuesta específica para esa consulta, pero nuestro equipo puede ayudarte. Escríbenos directamente a contacto@jmcdatanetworkgroup.com.',

  contacto: null,
}

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  enlace?: {
    texto: string
    url: string
  }
}

// Normaliza el texto para comparar preguntas
function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,]/g, '')
    .trim()
}

// Busca una respuesta en el catálogo
function findAnswer(userText: string) {
  const normalizedInput = normalizeText(userText)

  return CONFIG.preguntas.find((item) => {
    const normalizedQuestion = normalizeText(item.pregunta)

    return normalizedInput === normalizedQuestion
  })
}


export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: CONFIG.saludo,
      sender: 'bot',
    },
  ])

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
    selectedQuestion?: string
  ) => {
    e.preventDefault()

    const trimmedMessage = (
      selectedQuestion ?? message
    ).trim()

    if (!trimmedMessage || isTyping) return

    // Agregar mensaje del usuario
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmedMessage,
        sender: 'user',
      },
    ])

    setMessage('')
    setIsTyping(true)
    setHasAskedQuestion(true)

    // Buscar respuesta en las preguntas configuradas
    const matchedQuestion = findAnswer(trimmedMessage)

    const answer =
      matchedQuestion?.respuesta ??
      CONFIG.respuestaPredeterminada

    const enlace = matchedQuestion?.enlace

    // Simular tiempo de escritura
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: answer,
          sender: 'bot',
          enlace,
        },
      ])

      setIsTyping(false)
    }, CONFIG.retrasoRespuestaMs)
  }


  const handleQuestionClick = (question: string) => {
    const fakeEvent = {
      preventDefault: () => {
      },
    } as FormEvent<HTMLFormElement>

    handleSubmit(fakeEvent, question)
  }


  return (
    <div className="chat-widget">

      {/* VENTANA DEL CHAT */}

      {isOpen && (
        <section
          className="chat-window"
          aria-label="Chat de asistencia"
        >

          {/* ENCABEZADO */}

          <header className="chat-header">
            <div className="chat-header-info">

              <div className="chat-avatar">
                <img
                  src={CONFIG.icono}
                  alt="Logo de Chirper"
                  className="chat-logo"
                />
              </div>

              <div>
                <h3>{CONFIG.nombre}</h3>

                <span className="chat-status">
                  <span className="chat-status-dot"/>
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
              <Minus size={20}/>
            </button>
          </header>

          {/* MENSAJES */}

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
                    <Bot size={15}/>
                  </div>
                )}

                <div className="chat-message-content">

                  {/* TEXTO DE LA RESPUESTA */}

                  <div className="chat-message-text">
                    {item.text}
                  </div>

                  {/* ENLACE OPCIONAL */}

                  {item.enlace && (
                    <a
                      href={item.enlace.url}
                      className="chat-response-link"
                    >
                      {item.enlace.texto}
                    </a>
                  )}

                </div>

              </div>
            ))}

            {/* INDICADOR DE ESCRITURA */}

            {isTyping && (
              <div className="chat-message chat-message-bot">

                <div className="chat-message-avatar">
                  <Bot size={15}/>
                </div>

                <div className="chat-message-content chat-typing">
                  <span/>
                  <span/>
                  <span/>
                </div>

              </div>
            )}

            {/* PREGUNTAS FRECUENTES */}

            {!hasAskedQuestion && !isTyping && (
              <div className="chat-quick-questions">

                {CONFIG.preguntas.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className="chat-question-button"
                    onClick={() =>
                      handleQuestionClick(item.pregunta)
                    }
                  >
                    {item.pregunta}
                  </button>
                ))}

              </div>
            )}

            {/* PREGUNTAS ADICIONALES */}

            {hasAskedQuestion &&
              !isTyping &&
              messages.length > 1 && (
                <div className="chat-more-questions">
                  {CONFIG.textoMasPreguntas}
                </div>
              )}

            {/* PREGUNTAS DISPONIBLES DESPUÉS DE RESPONDER */}

            {hasAskedQuestion &&
              !isTyping &&
              messages.length > 1 && (
                <div className="chat-quick-questions">

                  {CONFIG.preguntas.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      className="chat-question-button"
                      onClick={() =>
                        handleQuestionClick(item.pregunta)
                      }
                    >
                      {item.pregunta}
                    </button>
                  ))}

                </div>
              )}

          </div>

          {/* PIE */}

          <div className="chat-footer">
            Atención al cliente · JMC Data & Network Group
          </div>

        </section>
      )}

      {/* BOTÓN FLOTANTE */}

      <button
        type="button"
        className={`chat-toggle ${
          isOpen ? 'chat-toggle-active' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
        aria-expanded={isOpen}
      >

        {isOpen ? (
          <X size={25}/>
        ) : (
          <>
            <img
              src={CONFIG.icono}
              alt="Logo de Chirper"
              className="chat-logo"
            />

            {CONFIG.avisoPendiente && (
              <span className="chat-notification"/>
            )}
          </>
        )}
      </button>
    </div>
  )
}