"use client"

import Link from "next/link"
import { GRADO3 } from "@/lib/clases"

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; icon_bg: string }> = {
  blue:   { bg: "bg-blue-50",   border: "border-blue-200",  text: "text-blue-700",  icon_bg: "bg-blue-100" },
  green:  { bg: "bg-green-50",  border: "border-green-200", text: "text-green-700", icon_bg: "bg-green-100" },
  purple: { bg: "bg-purple-50", border: "border-purple-200",text: "text-purple-700",icon_bg: "bg-purple-100" },
  orange: { bg: "bg-orange-50", border: "border-orange-200",text: "text-orange-700",icon_bg: "bg-orange-100" },
  teal:   { bg: "bg-teal-50",   border: "border-teal-200",  text: "text-teal-700",  icon_bg: "bg-teal-100" },
  red:    { bg: "bg-red-50",    border: "border-red-200",   text: "text-red-700",   icon_bg: "bg-red-100" },
}

export default function ClasesPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/tutor" className="text-sm text-gray-500 hover:text-gray-700">← Tutor</Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">📚 Clases de Matemáticas</h1>
          <p className="text-gray-500 mt-1">Tercer Grado · {GRADO3.unidades.length} unidades · {GRADO3.unidades.reduce((a, u) => a + u.lecciones.length, 0)} lecciones</p>
        </div>
      </div>

      {/* Unidades */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {GRADO3.unidades.map((unidad) => {
          const c = COLOR_MAP[unidad.color] ?? COLOR_MAP.blue
          return (
            <Link
              key={unidad.id}
              href={`/clases/${unidad.id}`}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 ${c.bg} ${c.border} hover:shadow-md transition-shadow`}
            >
              <div className={`w-14 h-14 rounded-xl ${c.icon_bg} flex items-center justify-center text-3xl flex-shrink-0`}>
                {unidad.icono}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-wide ${c.text} mb-0.5`}>
                  Unidad {unidad.id}
                </p>
                <h2 className="font-bold text-gray-900 text-lg leading-tight">{unidad.nombre}</h2>
                <p className="text-gray-500 text-sm mt-0.5 truncate">{unidad.descripcion}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className={`text-sm font-medium ${c.text}`}>{unidad.lecciones.length} lecciones</span>
                <div className="text-gray-400 text-lg mt-1">→</div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
