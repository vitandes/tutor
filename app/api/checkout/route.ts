import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"
import { crearSuscripcion, getMpToken, PLANES, type PlanKey } from "@/lib/mercadopago"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    if (!getMpToken()) {
      return new NextResponse("MELI_ACCESS_TOKEN no configurado", { status: 500 })
    }

    const email = user.emailAddresses[0]?.emailAddress
    if (!email) {
      return new NextResponse("Email requerido", { status: 400 })
    }

    const url = new URL(req.url)
    const planKey = (url.searchParams.get("plan") ?? "mensual") as PlanKey

    if (!PLANES[planKey]) {
      return new NextResponse(`Plan "${planKey}" no existe. Usa ?plan=mensual o ?plan=anual`, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    console.log(`[Checkout] Creando suscripción MP para ${email} plan=${planKey}`)

    // Crea la suscripción directamente en MP con external_reference = userId
    const { init_point, id: mpPreapprovalId } = await crearSuscripcion({
      planKey,
      userId,
      email,
      appUrl,
    })

    // Guarda el preapproval en Supabase antes de redirigir
    const supabase = createAdminClient()
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle()

    if (existing) {
      await supabase
        .from("subscriptions")
        .update({ status: "pending", plan: planKey, mp_preapproval_id: mpPreapprovalId })
        .eq("id", existing.id)
    } else {
      await supabase
        .from("subscriptions")
        .insert({ user_id: userId, status: "pending", plan: planKey, mp_preapproval_id: mpPreapprovalId })
    }

    console.log(`[Checkout] Redirigiendo a MP init_point preapproval=${mpPreapprovalId}`)
    return NextResponse.redirect(init_point)

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("[Checkout] Error:", msg)

    if (msg === "mp_not_configured") {
      return new NextResponse("Mercado Pago no configurado", { status: 500 })
    }

    return new NextResponse(
      JSON.stringify({ error: "Error al crear la suscripción", detalle: msg }),
      { status: 500 }
    )
  }
}
