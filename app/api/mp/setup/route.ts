import { NextResponse } from "next/server"
import { verificarToken, PLANES, getMpToken } from "@/lib/mercadopago"

// GET /api/mp/setup
// Verifica la conexión con Mercado Pago y muestra la configuración de planes.
// Úsalo una vez para confirmar que el token funciona antes de ir a producción.

export async function GET() {
  if (!getMpToken()) {
    return NextResponse.json({ error: "MELI_ACCESS_TOKEN no configurado en .env.local" }, { status: 500 })
  }

  try {
    const cuenta = await verificarToken()

    return NextResponse.json({
      ok: true,
      cuenta: {
        id: cuenta.id,
        email: cuenta.email,
        pais: cuenta.site_id,
      },
      planes: {
        mensual: {
          label: PLANES.mensual.label,
          monto: `$${PLANES.mensual.amount.toLocaleString("es-CO")} COP`,
          frecuencia: "cada 1 mes",
          prueba_gratis: `${PLANES.mensual.trial_days} días`,
        },
        anual: {
          label: PLANES.anual.label,
          monto: `$${PLANES.anual.amount.toLocaleString("es-CO")} COP`,
          frecuencia: "cada 12 meses",
          prueba_gratis: `${PLANES.anual.trial_days} días`,
        },
      },
      nota: "Los planes se crean en tiempo real al hacer checkout. No requieren setup previo en el panel de MP.",
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({
      error: "No se pudo conectar con Mercado Pago",
      detalle: msg,
      ayuda: msg.includes("401")
        ? "El MELI_ACCESS_TOKEN es inválido o expiró. Renuévalo en developers.mercadopago.com"
        : "Verifica la conexión y el token.",
    }, { status: 502 })
  }
}
