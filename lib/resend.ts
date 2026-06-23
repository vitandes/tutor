import { Resend } from 'resend'

const FROM = 'Tutor de Tareas <hola@tutordetareas.co>'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

export async function sendWelcomeEmail({
  to,
  firstName,
}: {
  to: string
  firstName?: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Resend] RESEND_API_KEY no configurado — email omitido')
    return { skipped: true }
  }

  const nombre = firstName ?? 'familia'

  try {
    const data = await getResend().emails.send({
      from: FROM,
      to,
      subject: '¡Bienvenidos a Tutor de Tareas! 🎒',
      html: `
        <div style="font-family:sans-serif;max-width:540px;margin:auto;padding:32px 24px">
          <h2 style="color:#14213d">¡Hola, ${nombre}! 👋</h2>
          <p>Tu cuenta de familia está lista. A partir de hoy tu hijo tiene un tutor que lo guía paso a paso sin regalarle las respuestas.</p>
          <p>Puedes entrar cuando quieras desde <a href="${process.env.NEXT_PUBLIC_APP_URL}/tutor">aquí</a>.</p>
          <p style="margin-top:32px;color:#6b7280;font-size:13px">Tutor de Tareas · Matemáticas de primaria</p>
        </div>
      `,
    })
    return data
  } catch (err) {
    console.error('[Resend] Error enviando welcome email:', err)
    return { error: err }
  }
}
