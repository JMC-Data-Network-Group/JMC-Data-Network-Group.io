
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'El mensaje es obligatorio' },
        { status: 400 }
      )
    }

    const question = message.toLowerCase().trim()

    let reply = ''

    // Lógica de respuestas del chatbot
    if (
      question.includes('hola') ||
      question.includes('buenos días')
    ) {
      reply = '¡Hola! Bienvenido. ¿En qué puedo ayudarte?'
    } else if (
      question.includes('servicios') ||
      question.includes('ofrecen')
    ) {
      reply =
        'Ofrecemos servicios de procesamiento y soluciones empresariales. ¿Te gustaría conocer más detalles?'
    } else if (
      question.includes('contacto') ||
      question.includes('teléfono')
    ) {
      reply =
        'Puedes comunicarte con nuestro equipo a través de la sección de contacto de nuestra página.'
    } else if (
      question.includes('horario')
    ) {
      reply =
        'Nuestro equipo puede orientarte sobre los horarios de atención.'
    } else {
      reply =
        'Gracias por tu consulta. ¿Podrías darme un poco más de información para ayudarte mejor?'
    }

    return NextResponse.json({ reply })

  } catch (error) {
    console.error('Error en el chatbot:', error)

    return NextResponse.json(
      { error: 'No fue posible procesar tu mensaje.' },
      { status: 500 }
    )
  }
}
