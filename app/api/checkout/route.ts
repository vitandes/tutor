import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const PLANES: Record<string, string | undefined> = {
  mensual: process.env.MP_PLAN_MENSUAL_ID,
  anual: process.env.MP_PLAN_ANUAL_ID,
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    const email = user.emailAddresses[0]?.emailAddress
    if (!email) {
      return new NextResponse('Email de usuario requerido', { status: 400 })
    }

    const meliAccessToken = process.env.MELI_ACCESS_TOKEN
    if (!meliAccessToken) {
      console.error('[Checkout] MELI_ACCESS_TOKEN no configurado')
      return new NextResponse('Error de configuración', { status: 500 })
    }

    const url = new URL(req.url)
    const planKey = url.searchParams.get('plan') ?? 'mensual'
    const planId = PLANES[planKey]

    if (!planId) {
      return new NextResponse(`Plan "${planKey}" no configurado. Agrega MP_PLAN_${planKey.toUpperCase()}_ID al .env`, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const backUrl = `${appUrl}/tutor`
    const notifUrl = `${appUrl}/api/webhooks/mercadopago`

    // Crear registro pending en Supabase antes de redirigir
    const supabase = createAdminClient()
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existing) {
      await supabase.from('subscriptions').update({ status: 'pending', plan: planKey }).eq('id', existing.id)
    } else {
      await supabase.from('subscriptions').insert({ user_id: userId, status: 'pending', plan: planKey })
    }

    const checkoutUrl = new URL('https://www.mercadopago.com.co/subscriptions/checkout')
    checkoutUrl.searchParams.set('preapproval_plan_id', planId)
    checkoutUrl.searchParams.set('external_reference', userId)
    checkoutUrl.searchParams.set('back_url', backUrl)
    checkoutUrl.searchParams.set('notification_url', notifUrl)

    console.log(`[Checkout] Redirigiendo ${email} a MP plan=${planKey}`)
    return NextResponse.redirect(checkoutUrl.toString())

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[Checkout] Error:', msg)
    return new NextResponse(JSON.stringify({ error: 'Error en proceso de pago', details: msg }), { status: 500 })
  }
}
