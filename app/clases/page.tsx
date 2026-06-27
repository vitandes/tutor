"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { getCurriculo } from "@/lib/clases"
import type { Curriculo } from "@/lib/clases"

const COLORES = [
  { fondo: "#e8f4fd", borde: "#2980b9", texto: "#1a5276" },
  { fondo: "#eafaf1", borde: "#27ae60", texto: "#1e8449" },
  { fondo: "#f5eef8", borde: "#8e44ad", texto: "#6c3483" },
  { fondo: "#fef9e7", borde: "#f39c12", texto: "#9a7d0a" },
  { fondo: "#e8f8f5", borde: "#16a085", texto: "#0e6655" },
  { fondo: "#fdedec", borde: "#e74c3c", texto: "#922b21" },
]

export default function ClasesPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const [curriculo, setCurriculo] = useState<Curriculo | null>(null)
  const [grado, setGrado] = useState<number>(3)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) { router.push("/sign-in"); return }
    fetch("/api/perfil")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (!d || !d.onboarding_completado) { router.push("/configurar"); return }
        const gradoNum = Number(d.grado) || 3
        setGrado(gradoNum)
        setCurriculo(getCurriculo(gradoNum) ?? getCurriculo(3))
        setCargando(false)
      })
  }, [isLoaded, isSignedIn, router])

  if (cargando) {
    return <main className="contenedor"><p className="nota">Cargando clases…</p></main>
  }

  if (!curriculo) {
    return <main className="contenedor"><p className="nota">No hay clases disponibles para este grado aún.</p></main>
  }

  const totalLecciones = curriculo.unidades.reduce((a, u) => a + u.lecciones.length, 0)

  return (
    <main className="contenedor">
      {/* Breadcrumb */}
      <div className="fila" style={{ justifyContent: "space-between", marginBottom: 4 }}>
        <Link href="/tutor" className="nota">← Tutor</Link>
      </div>

      {/* Título */}
      <h1 style={{ fontSize: 30, margin: "12px 0 4px" }}>
        📚 <span className="marca">Clases</span> de Matemáticas
      </h1>
      <p className="nota" style={{ marginBottom: 28 }}>
        {curriculo.titulo} · {curriculo.unidades.length} unidades · {totalLecciones} lecciones
      </p>

      {/* Grid de unidades */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {curriculo.unidades.map((unidad, i) => {
          const col = COLORES[i % COLORES.length]
          return (
            <Link
              key={unidad.id}
              href={`/clases/${grado}/${unidad.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: col.fondo,
                border: `2px solid ${col.borde}`,
                borderRadius: "var(--radio)",
                padding: "16px 20px",
                boxShadow: `4px 4px 0 ${col.borde}`,
                textDecoration: "none",
                color: "var(--tinta)",
                transition: "transform 0.08s ease, box-shadow 0.08s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translate(2px,2px)"
                ;(e.currentTarget as HTMLElement).style.boxShadow = `2px 2px 0 ${col.borde}`
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = ""
                ;(e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0 ${col.borde}`
              }}
            >
              {/* Ícono */}
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "#fff",
                border: `2px solid ${col.borde}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                flexShrink: 0,
              }}>
                {unidad.icono}
              </div>

              {/* Texto */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: col.texto, marginBottom: 2 }}>
                  Unidad {unidad.id}
                </p>
                <h2 style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 700, lineHeight: 1.2, marginBottom: 2 }}>
                  {unidad.nombre}
                </h2>
                <p style={{ fontSize: 13, color: "var(--gris)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {unidad.descripcion}
                </p>
              </div>

              {/* Contador */}
              <div style={{ flexShrink: 0, textAlign: "right" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: col.texto }}>
                  {unidad.lecciones.length} lecciones
                </span>
                <div style={{ fontSize: 20, color: col.borde, marginTop: 2 }}>→</div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
