import { sendWelcomeEmail } from './resend'

// Cada step de la secuencia de emails post-registro
export interface SequenceStep {
  step: number
  label: string
  dayOffset: number // días desde signup_at para enviar este email
  send: (params: { to: string; firstName?: string }) => Promise<unknown>
}

export const SEQUENCE: SequenceStep[] = [
  {
    step: 1,
    label: 'welcome',
    dayOffset: 0,
    send: sendWelcomeEmail,
  },
  // Agrega más steps aquí cuando tengas las plantillas listas:
  // { step: 2, label: 'temas', dayOffset: 2, send: sendTopicsEmail },
  // { step: 3, label: 'progreso', dayOffset: 5, send: sendProgressEmail },
]

export const TOTAL_STEPS = SEQUENCE.length

export function findNextStep(currentStep: number): SequenceStep | undefined {
  return SEQUENCE.find((s) => s.step === currentStep + 1)
}
