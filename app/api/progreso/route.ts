import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// GET /api/progreso — lista el progreso de todos los temas del usuario
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('progreso_temas')
    .select('tema_id, tema_nombre, preguntas_totales, resueltos_solo, ultima_sesion')
    .eq('user_id', userId)
    .order('ultima_sesion', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST /api/progreso — registra una pregunta o un logro
export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { tema_id, tema_nombre, tipo } = await req.json()
  // tipo: 'pregunta' | 'logro'
  if (!tema_id || !tipo) return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })

  const supabase = createAdminClient()

  // Verificar si ya existe el registro para este tema
  const { data: existing } = await supabase
    .from('progreso_temas')
    .select('id, preguntas_totales, resueltos_solo')
    .eq('user_id', userId)
    .eq('tema_id', tema_id)
    .single()

  if (existing) {
    const update =
      tipo === 'pregunta'
        ? { preguntas_totales: existing.preguntas_totales + 1, ultima_sesion: new Date().toISOString() }
        : { resueltos_solo: existing.resueltos_solo + 1, ultima_sesion: new Date().toISOString() }

    await supabase.from('progreso_temas').update(update).eq('id', existing.id)
  } else {
    await supabase.from('progreso_temas').insert({
      user_id: userId,
      tema_id,
      tema_nombre: tema_nombre ?? tema_id,
      preguntas_totales: tipo === 'pregunta' ? 1 : 0,
      resueltos_solo: tipo === 'logro' ? 1 : 0,
      ultima_sesion: new Date().toISOString(),
    })
  }

  return NextResponse.json({ ok: true })
}
