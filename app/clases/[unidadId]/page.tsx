"use client"

import Link from "next/link"
import { use } from "react"
import { getUnidad } from "@/lib/clases"
import { notFound } from "next/navigation"

const COLORES = [
  { fondo: "#e8f4fd", borde: "#2980b9", texto: "#1a5276", header: "#2980b9" },
  { fondo: "#eafaf1", borde: "#27ae60", texto: "#1e8449", header: "#27ae60" },
  { fondo: "#f5eef8", borde: "#8e44ad", texto: "#6c3483", header: "#8e44ad" },
  { fondo: "#fef9e7", borde: "#f39c12", texto: "#9a7d0a", header: "#e67e22" },
  { fondo: "#e8f8f5", borde: "#16a085", texto: "#0e6655", header: "#16a085" },
  { fondo: "#fdedec", borde: "#e74c3c", texto: "#922b21", header: "#e74c3c" },
]

export default function UnidadPage({ params }: { params: Promise<{ unidadId: string }> }) {
  const { unidadId } = use(params)
  const unidad = getUnidad(3, Number(unidadId))
  if (!unidad) notFound()

  const col = COLORES[(unidad.id - 1) % COLORES.length]

  return (
    <main className="contenedor">
      {/* Breadcrumb */}
      <div className="fila" style={{ gap: 6, marginBottom: 16, fontSize: 13, color: "var(--gris)" }}>
        <Link href="/clases" className="nota">📚 Clases</Link>
        <span>›</span>
        <span>Unidad {unidad.id}</span>
      </div>

      {/* Header de unidad */}
      <div className="tarjeta" style={{
        background: col.fondo,
        border: `2px solid ${col.borde}`,
        boxShadow: `4px 4px 0 ${col.borde}`,
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: "#fff",
          border: `2px solid ${col.borde}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          flexShrink: 0,
        }}>
          {unidad.icono}
        </div>
        <div>
          <p className="eyebrow" style={{ color: col.texto }}>Unidad {unidad.id}</p>
          <h1 style={{ fontSize: 22, margin: "4px 0 2px" }}>{unidad.nombre}</h1>
          <p className="nota">{unidad.descripcion}</p>
        </div>
      </div>

      {/* Lista de lecciones */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {unidad.lecciones.map((leccion, idx) => (
          <Link
            key={leccion.id}
            href={`/clases/${unidad.id}/${leccion.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#fff",
              border: "2px solid var(--tinta)",
              borderRadius: "var(--radio)",
              padding: "14px 18px",
              boxShadow: "3px 3px 0 var(--tinta)",
              textDecoration: "none",
              color: "var(--tinta)",
              transition: "transform 0.08s, box-shadow 0.08s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translate(2px,2px)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "1px 1px 0 var(--tinta)"
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = ""
              ;(e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0 var(--tinta)"
            }}
          >
            {/* Número */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: col.header,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--display)",
              fontWeight: 700,
              fontSize: 15,
              flexShrink: 0,
            }}>
              {idx + 1}
            </div>

            {/* Texto */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>
                {leccion.titulo}
              </p>
              <p style={{ fontSize: 12, color: "var(--gris)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {leccion.objetivo}
              </p>
            </div>

            {/* Meta */}
            <div style={{ flexShrink: 0, textAlign: "right", fontSize: 12, color: "var(--gris)" }}>
              <div>{leccion.ejercicios.length} ejercicios</div>
              <div style={{ fontSize: 18, color: col.borde, marginTop: 2 }}>›</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href="/clases" className="nota">← Ver todas las unidades</Link>
      </div>
    </main>
  )
}
