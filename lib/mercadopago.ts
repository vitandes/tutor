// Helpers de Mercado Pago — Suscripciones (preapproval).
//
// Usamos preapproval SIN plan_id para poder pasar external_reference = userId.
// Los checkout basados en preapproval_plan_id ignoran external_reference,
// por eso los precios viven en código.

const MP_API = "https://api.mercadopago.com"

export function getMpToken(): string | null {
  return process.env.MELI_ACCESS_TOKEN || null
}

// ── Configuración de planes ───────────────────────────────
export type PlanKey = "mensual" | "anual"

interface PlanConfig {
  label: string
  frequency: number        // 1 = mes, 12 = año
  frequency_type: "months"
  amount: number           // COP
  trial_days: number
}

// Colombia → site_id "MCO", currency "COP"
export const SITE_ID = "MCO"
export const CURRENCY = "COP"

export const PLANES: Record<PlanKey, PlanConfig> = {
  mensual: {
    label: "Plan Mensual - Tutor de Tareas",
    frequency: 1,
    frequency_type: "months",
    amount: 39900,   // COP producción
    trial_days: 3,
  },
  anual: {
    label: "Plan Anual - Tutor de Tareas",
    frequency: 12,
    frequency_type: "months",
    amount: 199900,  // COP producción
    trial_days: 3,
  },
}

// ── Fetch base con auth ───────────────────────────────────
export async function mpFetch<T = unknown>(
  path: string,
  { method = "GET", body }: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = getMpToken()
  if (!token) throw new Error("mp_not_configured")

  const res = await fetch(`${MP_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const err = new Error(data?.message || `mp_error_${res.status}`)
    ;(err as NodeJS.ErrnoException).code = String(res.status)
    throw err
  }

  return data as T
}

// ── Crear suscripción (preapproval inline) ────────────────
export async function crearSuscripcion({
  planKey,
  userId,
  email,
  appUrl,
}: {
  planKey: PlanKey
  userId: string
  email: string
  appUrl: string
}): Promise<{ init_point: string; id: string }> {
  const plan = PLANES[planKey]
  const testAmount = process.env.MP_TEST_AMOUNT ? Number(process.env.MP_TEST_AMOUNT) : null

  const body = {
    reason: plan.label,
    payer_email: email,
    external_reference: userId,
    back_url: `${appUrl}/tutor`,
    notification_url: `${appUrl}/api/webhooks/mercadopago`,
    status: "pending",
    auto_recurring: {
      frequency: plan.frequency,
      frequency_type: plan.frequency_type,
      transaction_amount: testAmount && testAmount > 0 ? testAmount : plan.amount,
      currency_id: CURRENCY,
      free_trial: {
        frequency: plan.trial_days,
        frequency_type: "days",
      },
    },
  }

  const data = await mpFetch<{ id: string; init_point: string }>("/preapproval", {
    method: "POST",
    body,
  })

  return { init_point: data.init_point, id: data.id }
}

// ── Consultar estado de suscripción ──────────────────────
export async function obtenerSuscripcion(preapprovalId: string) {
  return mpFetch<{ id: string; status: string; external_reference: string; next_payment_date: string }>(
    `/preapproval/${preapprovalId}`
  )
}

// ── Cancelar suscripción ──────────────────────────────────
export async function cancelarSuscripcion(preapprovalId: string) {
  return mpFetch(`/preapproval/${preapprovalId}`, {
    method: "PUT",
    body: { status: "cancelled" },
  })
}

// ── Info de la cuenta MP (para verificar token) ───────────
export async function verificarToken(): Promise<{ id: number; email: string; site_id: string }> {
  return mpFetch("/users/me")
}
