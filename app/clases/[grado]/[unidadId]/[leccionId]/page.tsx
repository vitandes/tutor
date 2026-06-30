"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { getLeccion, getUnidad, getLeccionAnteriorSiguiente } from "@/lib/clases"
import type { Ejercicio } from "@/lib/clases"
import { notFound } from "next/navigation"

const COLORES = [
  { fondo: "#e8f4fd", borde: "#2980b9", texto: "#1a5276", header: "#2980b9" },
  { fondo: "#eafaf1", borde: "#27ae60", texto: "#1e8449", header: "#27ae60" },
  { fondo: "#f5eef8", borde: "#8e44ad", texto: "#6c3483", header: "#8e44ad" },
  { fondo: "#fef9e7", borde: "#f39c12", texto: "#9a7d0a", header: "#e67e22" },
  { fondo: "#e8f8f5", borde: "#16a085", texto: "#0e6655", header: "#16a085" },
  { fondo: "#fdedec", borde: "#e74c3c", texto: "#922b21", header: "#e74c3c" },
]

type EstadoRespuesta = { valor: string; revisada: boolean; correcta: boolean | null }

function EjercicioCard({ ejercicio, numero, col }: {
  ejercicio: Ejercicio
  numero: number
  col: typeof COLORES[0]
}) {
  const [estado, setEstado] = useState<EstadoRespuesta>({ valor: "", revisada: false, correcta: null })
  const [mostrarPista, setMostrarPista] = useState(false)

  function normalizar(s: string) {
    return s.trim().toLowerCase().replace(/[\s.,]/g, "")
  }

  function verificar() {
    const correcta = normalizar(estado.valor) === normalizar(String(ejercicio.respuesta))
    setEstado((p) => ({ ...p, revisada: true, correcta }))
  }

  function reintentar() {
    setEstado({ valor: "", revisada: false, correcta: null })
    setMostrarPista(false)
  }

  const borderColor = estado.revisada ? (estado.correcta ? "#27ae60" : "#e74c3c") : "var(--tinta)"
  const fondoColor = estado.revisada ? (estado.correcta ? "#eafaf1" : "#fdedec") : "#fff"

  return (
    <div style={{
      background: fondoColor,
      border: `2px solid ${borderColor}`,
      borderRadius: "var(--radio)",
      boxShadow: `3px 3px 0 ${borderColor}`,
      padding: "16px 18px",
    }}>
      <div className="fila" style={{ alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: col.header, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--display)", fontWeight: 700, fontSize: 14,
          flexShrink: 0, marginTop: 2,
        }}>
          {numero}
        </div>
        <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.4, flex: 1 }}>{ejercicio.enunciado}</p>
      </div>

      {!estado.revisada ? (
        <div style={{ paddingLeft: 44 }}>
          {ejercicio.tipo === "seleccion" && ejercicio.opciones && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ejercicio.opciones.map((op) => (
                <button
                  key={op}
                  onClick={() => setEstado((p) => ({ ...p, valor: op }))}
                  style={{
                    textAlign: "left", padding: "10px 14px", borderRadius: 12,
                    border: `2px solid ${estado.valor === op ? col.borde : "var(--linea)"}`,
                    background: estado.valor === op ? col.fondo : "#f8f9fa",
                    color: estado.valor === op ? col.texto : "var(--tinta)",
                    fontFamily: "var(--texto)", fontSize: 14,
                    fontWeight: estado.valor === op ? 700 : 400, cursor: "pointer",
                  }}
                >
                  {op}
                </button>
              ))}
            </div>
          )}

          {(ejercicio.tipo === "numero" || ejercicio.tipo === "texto") && (
            <input
              type={ejercicio.tipo === "numero" ? "number" : "text"}
              value={estado.valor}
              onChange={(e) => setEstado((p) => ({ ...p, valor: e.target.value }))}
              placeholder={ejercicio.tipo === "numero" ? "Escribe el número..." : "Escribe tu respuesta..."}
              onKeyDown={(e) => e.key === "Enter" && estado.valor && verificar()}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 12,
                border: "2px solid var(--linea)", fontFamily: "var(--texto)",
                fontSize: 15, outline: "none", background: "#f8f9fa",
              }}
            />
          )}

          <div className="fila" style={{ marginTop: 12, gap: 12 }}>
            <button onClick={verificar} disabled={!estado.valor} className="btn" style={{ fontSize: 14, padding: "9px 18px" }}>
              Verificar
            </button>
            <button
              onClick={() => setMostrarPista(!mostrarPista)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gris)", fontSize: 13, textDecoration: "underline", fontFamily: "var(--texto)" }}
            >
              {mostrarPista ? "Ocultar pista" : "💡 Ver pista"}
            </button>
          </div>

          {mostrarPista && (
            <div style={{ marginTop: 10, padding: "10px 14px", background: "var(--marcador)", borderRadius: 10, border: "2px solid var(--tinta)", fontSize: 13 }}>
              💡 {ejercicio.pista}
            </div>
          )}
        </div>
      ) : (
        <div style={{ paddingLeft: 44 }}>
          {estado.correcta ? (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22 }}>✅</span>
              <div>
                <p style={{ fontFamily: "var(--display)", fontWeight: 700, color: "#1e8449", fontSize: 15 }}>¡Correcto!</p>
                <p style={{ fontSize: 13, color: "#1e8449", marginTop: 4, lineHeight: 1.5 }}>{ejercicio.explicacion}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22 }}>❌</span>
              <div>
                <p style={{ fontFamily: "var(--display)", fontWeight: 700, color: "#922b21", fontSize: 15 }}>¡Casi, tú puedes!</p>
                <p style={{ fontSize: 13, color: "#922b21", marginTop: 4, lineHeight: 1.5 }}>{ejercicio.explicacion}</p>
                <button
                  onClick={reintentar}
                  style={{ marginTop: 8, background: "none", border: "none", cursor: "pointer", color: "#922b21", fontFamily: "var(--texto)", fontSize: 13, fontWeight: 700, textDecoration: "underline" }}
                >
                  🔄 Intentar de nuevo
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
  params: Promise<{ grado: string; unidadId: string; leccionId: string }>
}) {
  const { grado, unidadId, leccionId } = use(params)
  const gradoNum = Number(grado)
  const unidadNum = Number(unidadId)
  const unidad = getUnidad(gradoNum, unidadNum)
  const leccion = getLeccion(gradoNum, unidadNum, leccionId)
  if (!unidad || !leccion) notFound()

  const [plan, setPlan] = useState<string | null>(null)
  useEffect(() => {
    fetch("/api/perfil").then((r) => r.json()).then((d) => setPlan(d?.plan ?? "free"))
  }, [])

  const { anterior, siguiente } = getLeccionAnteriorSiguiente(gradoNum, unidadNum, leccionId)
  const col = COLORES[(unidad.id - 1) % COLORES.length]
  const tutorUrl = `/tutor?tema=${encodeURIComponent(leccion.titulo)}&contexto=${encodeURIComponent(`Estoy estudiando: ${leccion.titulo}. ${leccion.concepto_clave}`)}`

  const esPro = plan === "mensual" || plan === "anual"
  const bloqueada = plan !== null && !esPro

  if (plan === null) {
    return <main className="contenedor"><p className="nota">Cargando…</p></main>
  }

  // Paywall para lecciones bloqueadas
  if (bloqueada) {
    return (
      <main className="contenedor">
        <div className="fila" style={{ gap: 6, marginBottom: 16, fontSize: 13, color: "var(--gris)" }}>
          <Link href="/clases" className="nota">📚 Clases</Link>
          <span>›</span>
          <Link href={`/clases/${grado}/${unidadId}`} className="nota">{unidad.nombre}</Link>
          <span>›</span>
          <span style={{ color: "var(--tinta)" }}>{leccion.titulo}</span>
        </div>
        <div className="tarjeta" style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Contenido Pro</h2>
          <p style={{ fontSize: 15, color: "var(--gris)", marginBottom: 8 }}>
            <strong>{leccion.titulo}</strong> requiere un plan activo.
          </p>
          <p className="nota" style={{ marginBottom: 24 }}>
            Activa tu plan para acceder a todas las lecciones, ejercicios y el tutor. Incluye días de prueba gratis — sin cobro hasta que termine el período.
          </p>
          <Link href="/api/checkout?plan=mensual" className="btn coral" style={{ display: "inline-block", marginBottom: 10 }}>
            Activar plan mensual · $39.900/mes →
          </Link>
          <br />
          <Link href="/api/checkout?plan=anual" className="btn fantasma" style={{ display: "inline-block", marginTop: 8 }}>
            Plan anual · $199.999/año (ahorra 58%)
          </Link>
          <p style={{ marginTop: 20 }}>
            <Link href={`/clases/${grado}/${unidadId}`} className="nota">← Volver a la unidad</Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="contenedor">
      {/* Breadcrumb */}
      <div className="fila" style={{ gap: 6, marginBottom: 16, fontSize: 13, color: "var(--gris)" }}>
        <Link href="/clases" className="nota">📚 Clases</Link>
        <span>›</span>
        <Link href={`/clases/${grado}/${unidadId}`} className="nota">{unidad.nombre}</Link>
        <span>›</span>
        <span style={{ color: "var(--tinta)" }}>{leccion.titulo}</span>
      </div>

      {/* Título */}
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>{leccion.titulo}</h1>
      <p className="nota" style={{ marginBottom: 20 }}>🎯 {leccion.objetivo}</p>

      {/* Concepto clave */}
      <div style={{
        background: "var(--marcador)", border: "2px solid var(--tinta)",
        borderRadius: "var(--radio)", boxShadow: "3px 3px 0 var(--tinta)",
        padding: "14px 18px", marginBottom: 20,
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>💡 Concepto clave</p>
        <p style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 15, lineHeight: 1.4 }}>{leccion.concepto_clave}</p>
      </div>

      {/* Explicación */}
      <div className="tarjeta" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>📖 Explicación</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {leccion.explicacion.map((p, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#333" }}>{p}</p>
          ))}
        </div>
      </div>

      {/* Ejemplos */}
      <div className="tarjeta" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>✏️ Ejemplos resueltos</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {leccion.ejemplos.map((ejemplo, i) => (
            <div key={i} style={{ background: "#f8f9fa", border: "2px solid var(--linea)", borderRadius: 14, padding: "14px 16px" }}>
              <div className="fila" style={{ alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: col.header, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--display)", fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{ejemplo.enunciado}</p>
              </div>
              <div style={{ paddingLeft: 36, display: "flex", flexDirection: "column", gap: 6 }}>
                {ejemplo.pasos.map((paso, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, fontSize: 13 }}>
                    <span style={{ color: "var(--gris)", flexShrink: 0 }}>→</span>
                    <span>
                      {paso.texto}
                      {paso.detalle && <span style={{ color: "var(--gris)", marginLeft: 6 }}>({paso.detalle})</span>}
                    </span>
                  </div>
                ))}
                <div style={{
                  marginTop: 8, padding: "8px 12px",
                  background: col.fondo, border: `2px solid ${col.borde}`,
                  borderRadius: 10, fontSize: 13,
                  fontFamily: "var(--display)", fontWeight: 700, color: col.texto,
                }}>
                  ✅ {ejemplo.resultado}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ejercicios */}
      <h2 style={{ fontSize: 20, marginBottom: 14 }}>🎯 ¡Practica tú!</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        {leccion.ejercicios.map((ej, i) => (
          <EjercicioCard key={ej.id} ejercicio={ej} numero={i + 1} col={col} />
        ))}
      </div>

      {/* CTA Tutor */}
      <div className="tarjeta" style={{ textAlign: "center", marginBottom: 24 }}>
        <p className="nota" style={{ marginBottom: 12 }}>¿Tienes alguna duda sobre esta lección?</p>
        <Link href={tutorUrl} className="btn coral" style={{ display: "inline-block" }}>
          🤖 Preguntarle al tutor
        </Link>
      </div>

      {/* Navegación */}
      <div className="fila" style={{ gap: 12 }}>
        {anterior && (
          <Link
            href={`/clases/${grado}/${unidadId}/${anterior.id}`}
            style={{ flex: 1, background: "#fff", border: "2px solid var(--tinta)", borderRadius: "var(--radio)", boxShadow: "3px 3px 0 var(--tinta)", padding: "12px 16px", textDecoration: "none", color: "var(--tinta)", display: "block" }}
          >
            <p style={{ fontSize: 11, color: "var(--gris)", marginBottom: 4 }}>← Lección anterior</p>
            <p style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{anterior.titulo}</p>
          </Link>
        )}
        {siguiente && (
          <Link
            href={`/clases/${grado}/${unidadId}/${siguiente.id}`}
            style={{ flex: 1, background: "#fff", border: "2px solid var(--tinta)", borderRadius: "var(--radio)", boxShadow: "3px 3px 0 var(--tinta)", padding: "12px 16px", textDecoration: "none", color: "var(--tinta)", display: "block", textAlign: "right" }}
          >
            <p style={{ fontSize: 11, color: "var(--gris)", marginBottom: 4 }}>Siguiente lección →</p>
            <p style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{siguiente.titulo}</p>
          </Link>
        )}
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Link href={`/clases/${grado}/${unidadId}`} className="nota">Ver todas las lecciones de esta unidad</Link>
      </div>
    </main>
  )
}
