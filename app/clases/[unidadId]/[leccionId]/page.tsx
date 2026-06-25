"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getLeccion, getUnidad, getLeccionAnteriorSiguiente } from "@/lib/clases"
import type { Ejercicio } from "@/lib/clases"
import { notFound } from "next/navigation"

const COLOR_MAP: Record<string, { accent: string; light: string; text: string; btn: string }> = {
  blue:   { accent: "bg-blue-600",   light: "bg-blue-50",   text: "text-blue-700",  btn: "bg-blue-600 hover:bg-blue-700" },
  green:  { accent: "bg-green-600",  light: "bg-green-50",  text: "text-green-700", btn: "bg-green-600 hover:bg-green-700" },
  purple: { accent: "bg-purple-600", light: "bg-purple-50", text: "text-purple-700",btn: "bg-purple-600 hover:bg-purple-700" },
  orange: { accent: "bg-orange-500", light: "bg-orange-50", text: "text-orange-700",btn: "bg-orange-500 hover:bg-orange-600" },
  teal:   { accent: "bg-teal-600",   light: "bg-teal-50",   text: "text-teal-700",  btn: "bg-teal-600 hover:bg-teal-700" },
  red:    { accent: "bg-red-600",    light: "bg-red-50",    text: "text-red-700",   btn: "bg-red-600 hover:bg-red-700" },
}

type RespuestaEstado = {
  valor: string
  revisada: boolean
  correcta: boolean | null
}

function EjercicioCard({
  ejercicio,
  numero,
  color,
}: {
  ejercicio: Ejercicio
  numero: number
  color: string
}) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue
  const [estado, setEstado] = useState<RespuestaEstado>({ valor: "", revisada: false, correcta: null })
  const [mostrarPista, setMostrarPista] = useState(false)

  function verificar() {
    const respuestaLimpia = estado.valor.trim().toLowerCase().replace(/\s+/g, "").replace(/\./g, "")
    const correctaLimpia = String(ejercicio.respuesta).toLowerCase().replace(/\s+/g, "").replace(/\./g, "")
    const correcta = respuestaLimpia === correctaLimpia
    setEstado((p) => ({ ...p, revisada: true, correcta }))
  }

  function reintentar() {
    setEstado({ valor: "", revisada: false, correcta: null })
    setMostrarPista(false)
  }

  return (
    <div className={`rounded-2xl border-2 p-5 ${estado.revisada ? (estado.correcta ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50") : "border-gray-200 bg-white"}`}>
      {/* Número y enunciado */}
      <div className="flex gap-3 mb-4">
        <div className={`w-8 h-8 rounded-full ${c.accent} text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5`}>
          {numero}
        </div>
        <p className="text-gray-900 font-medium leading-snug">{ejercicio.enunciado}</p>
      </div>

      {/* Input según tipo */}
      {!estado.revisada ? (
        <>
          {ejercicio.tipo === "seleccion" && ejercicio.opciones && (
            <div className="space-y-2 ml-11">
              {ejercicio.opciones.map((opcion) => (
                <button
                  key={opcion}
                  onClick={() => setEstado((p) => ({ ...p, valor: opcion }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    estado.valor === opcion
                      ? `${c.light} ${c.text} border-current`
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
          )}

          {(ejercicio.tipo === "numero" || ejercicio.tipo === "texto") && (
            <div className="ml-11">
              <input
                type={ejercicio.tipo === "numero" ? "number" : "text"}
                value={estado.valor}
                onChange={(e) => setEstado((p) => ({ ...p, valor: e.target.value }))}
                placeholder={ejercicio.tipo === "numero" ? "Escribe el número..." : "Escribe tu respuesta..."}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
                onKeyDown={(e) => e.key === "Enter" && estado.valor && verificar()}
              />
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center gap-3 mt-4 ml-11">
            <button
              onClick={verificar}
              disabled={!estado.valor}
              className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${c.btn}`}
            >
              Verificar
            </button>
            <button
              onClick={() => setMostrarPista(!mostrarPista)}
              className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
            >
              {mostrarPista ? "Ocultar pista" : "💡 Ver pista"}
            </button>
          </div>

          {mostrarPista && (
            <div className={`mt-3 ml-11 px-4 py-3 rounded-xl ${c.light} ${c.text} text-sm`}>
              💡 {ejercicio.pista}
            </div>
          )}
        </>
      ) : (
        <div className="ml-11">
          {estado.correcta ? (
            <div className="flex items-start gap-2">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-green-700">¡Correcto!</p>
                <p className="text-sm text-green-600 mt-1">{ejercicio.explicacion}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <span className="text-2xl">❌</span>
              <div>
                <p className="font-semibold text-red-700">Casi, sigue intentando</p>
                <p className="text-sm text-red-600 mt-1">{ejercicio.explicacion}</p>
                <button
                  onClick={reintentar}
                  className="mt-2 text-sm font-medium text-red-700 underline underline-offset-2"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function LeccionPage({
  params,
}: {
  params: Promise<{ unidadId: string; leccionId: string }>
}) {
  const { unidadId, leccionId } = use(params)
  const unidadNum = Number(unidadId)
  const unidad = getUnidad(3, unidadNum)
  const leccion = getLeccion(3, unidadNum, leccionId)
  if (!unidad || !leccion) notFound()

  const { anterior, siguiente } = getLeccionAnteriorSiguiente(3, unidadNum, leccionId)
  const c = COLOR_MAP[unidad.color] ?? COLOR_MAP.blue
  const router = useRouter()

  const tutorUrl = `/tutor?tema=${encodeURIComponent(leccion.titulo)}&contexto=${encodeURIComponent(`Estoy estudiando: ${leccion.titulo}. ${leccion.concepto_clave}`)}`

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`${c.accent} text-white px-4 pt-5 pb-8`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4 text-white/70 text-sm">
            <Link href="/clases" className="hover:text-white">📚 Clases</Link>
            <span>›</span>
            <Link href={`/clases/${unidadId}`} className="hover:text-white">{unidad.nombre}</Link>
          </div>
          <h1 className="text-xl font-bold leading-tight">{leccion.titulo}</h1>
          <p className="text-white/80 text-sm mt-1">🎯 {leccion.objetivo}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4 space-y-5">

        {/* Concepto clave */}
        <div className={`${c.light} border-2 border-current ${c.text} rounded-2xl px-5 py-4`}>
          <p className="text-xs font-bold uppercase tracking-wide mb-1 opacity-70">💡 Concepto clave</p>
          <p className="font-semibold text-sm leading-snug">{leccion.concepto_clave}</p>
        </div>

        {/* Explicación */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-lg">📖</span> Explicación
          </h2>
          <div className="space-y-3">
            {leccion.explicacion.map((parrafo, i) => (
              <p key={i} className="text-gray-700 text-sm leading-relaxed">{parrafo}</p>
            ))}
          </div>
        </div>

        {/* Ejemplos resueltos */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-lg">✏️</span> Ejemplos resueltos
          </h2>
          <div className="space-y-5">
            {leccion.ejemplos.map((ejemplo, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="font-semibold text-gray-800 text-sm mb-3">
                  <span className={`inline-flex w-6 h-6 rounded-full ${c.accent} text-white items-center justify-center text-xs mr-2`}>{i + 1}</span>
                  {ejemplo.enunciado}
                </p>
                <div className="space-y-2 ml-8">
                  {ejemplo.pasos.map((paso, j) => (
                    <div key={j} className="flex gap-2 text-sm">
                      <span className="text-gray-400 flex-shrink-0">→</span>
                      <div>
                        <span className="text-gray-700">{paso.texto}</span>
                        {paso.detalle && (
                          <span className="text-gray-500 ml-1">({paso.detalle})</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className={`mt-3 px-3 py-2 rounded-lg ${c.light} ${c.text} text-sm font-semibold`}>
                    ✅ {ejemplo.resultado}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ejercicios */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
            <span>🎯</span> ¡Practica tú!
          </h2>
          <div className="space-y-3">
            {leccion.ejercicios.map((ejercicio, i) => (
              <EjercicioCard
                key={ejercicio.id}
                ejercicio={ejercicio}
                numero={i + 1}
                color={unidad.color}
              />
            ))}
          </div>
        </div>

        {/* Botón tutor */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-gray-600 text-sm mb-3">¿Tienes alguna duda sobre esta lección?</p>
          <Link
            href={tutorUrl}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            🤖 Preguntarle al tutor
          </Link>
        </div>

        {/* Navegación siguiente/anterior */}
        <div className="flex gap-3">
          {anterior && (
            <Link
              href={`/clases/${unidadId}/${anterior.id}`}
              className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow text-left"
            >
              <p className="text-xs text-gray-400 mb-1">← Lección anterior</p>
              <p className="text-sm font-semibold text-gray-700 line-clamp-2">{anterior.titulo}</p>
            </Link>
          )}
          {siguiente && (
            <Link
              href={`/clases/${unidadId}/${siguiente.id}`}
              className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow text-right"
            >
              <p className="text-xs text-gray-400 mb-1">Siguiente lección →</p>
              <p className="text-sm font-semibold text-gray-700 line-clamp-2">{siguiente.titulo}</p>
            </Link>
          )}
        </div>

        <div className="text-center">
          <Link href={`/clases/${unidadId}`} className="text-sm text-gray-400 hover:text-gray-600">
            Ver todas las lecciones de esta unidad
          </Link>
        </div>
      </div>
    </main>
  )
}
