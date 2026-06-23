import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// GET /api/perfil — devuelve el perfil del usuario autenticado
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('nombre_padre, nombre_hijo, grado, plan, onboarding_completado')
    .eq('id', userId)
    .single()

  if (error || !data) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(data)
}

// POST /api/perfil — guarda el onboarding (nombre hijo + grado)
export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { nombre_padre, nombre_hijo, grado } = body

  if (!nombre_hijo?.trim() || !grado) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  // Obtener email desde Clerk para el caso en que el webhook no haya creado el perfil aún
  const { currentUser } = await import('@clerk/nextjs/server')
  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? ''

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email,
      nombre_padre: nombre_padre?.trim() ?? null,
      nombre_hijo: nombre_hijo.trim(),
      grado,
      onboarding_completado: true,
    }, { onConflict: 'id' })

  if (error) {
    console.error('[Perfil] Error en upsert:', error)
    return NextResponse.json({ error: 'Error guardando perfil' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
