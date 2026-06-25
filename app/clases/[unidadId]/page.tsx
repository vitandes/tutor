"use client"

import Link from "next/link"
import { use } from "react"
import { getUnidad, GRADO3 } from "@/lib/clases"
import { notFound } from "next/navigation"

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string; icon_bg: string }> = {
  blue:   { bg: "bg-blue-600",   border: "border-blue-200",  text: "text-blue-700",  badge: "bg-blue-100 text-blue-700",   icon_bg: "bg-blue-50" },
  green:  { bg: "bg-green-600",  border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700",  icon_bg: "bg-green-50" },
  purple: { bg: "bg-purple-600", border: "border-purple-200",text: "text-purple-700",badge: "bg-purple-100 text-purple-700",icon_bg: "bg-purple-50" },
  orange: { bg: "bg-orange-500", border: "border-orange-200",text: "text-orange-700",badge: "bg-orange-100 text-orange-700",icon_bg: "bg-orange-50" },
  teal:   { bg: "bg-teal-600",   border: "border-teal-200",  text: "text-teal-700",  badge: "bg-teal-100 text-teal-700",   icon_bg: "bg-teal-50" },
  red:    { bg: "bg-red-600",    border: "border-red-200",   text: "text-red-700",   badge: "bg-red-100 text-red-700",     icon_bg: "bg-red-50" },
}

export default function UnidadPage({ params }: { params: Promise<{ unidadId: string }> }) {
  const { unidadId } = use(params)
  const unidad = getUnidad(3, Number(unidadId))
  if (!unidad) notFound()

  const c = COLOR_MAP[unidad.color] ?? COLOR_MAP.blue

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Header de color */}
      <div className={`${c.bg} text-white px-4 pt-6 pb-12`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4 text-white/80 text-sm">
            <Link href="/clases" className="hover:text-white">📚 Clases</Link>
            <span>›</span>
            <span>Unidad {unidad.id}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
              {unidad.icono}
            </div>
            <div>
              <p className="text-white/70 text-sm uppercase tracking-wide font-semibold">Unidad {unidad.id}</p>
              <h1 className="text-2xl font-bold">{unidad.nombre}</h1>
              <p className="text-white/80 text-sm mt-0.5">{unidad.lecciones.length} lecciones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de lecciones */}
      <div className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {unidad.lecciones.map((leccion, idx) => (
            <Link
              key={leccion.id}
              href={`/clases/${unidad.id}/${leccion.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div className={`w-9 h-9 rounded-full ${c.icon_bg} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-sm font-bold ${c.text}`}>{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{leccion.titulo}</h3>
                <p className="text-gray-500 text-xs mt-0.5 truncate">{leccion.objetivo}</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="text-xs text-gray-400">{leccion.ejercicios.length} ejercicios</span>
                <span className="text-gray-400">›</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4">
          <Link
            href="/clases"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            ← Ver todas las unidades
          </Link>
        </div>
      </div>
    </main>
  )
}
