import type { Curriculo, Unidad, Leccion } from "./tipos"

// Grado 3
import g3u1 from "./grado3/unidad1"
import g3u2 from "./grado3/unidad2"
import g3u3 from "./grado3/unidad3"
import g3u4 from "./grado3/unidad4"
import g3u5 from "./grado3/unidad5"
import g3u6 from "./grado3/unidad6"

// Grado 4
import g4u1 from "./grado4/unidad1"
import g4u2 from "./grado4/unidad2"
import g4u3 from "./grado4/unidad3"
import g4u4 from "./grado4/unidad4"

// Grado 5
import g5u1 from "./grado5/unidad1"
import g5u2 from "./grado5/unidad2"
import g5u3 from "./grado5/unidad3"
import g5u4 from "./grado5/unidad4"
import g5u5 from "./grado5/unidad5"
import g5u6 from "./grado5/unidad6"

export * from "./tipos"

export const GRADO3: Curriculo = {
  grado: 3,
  titulo: "Matemáticas 3er Grado",
  unidades: [g3u1, g3u2, g3u3, g3u4, g3u5, g3u6],
}

export const GRADO4: Curriculo = {
  grado: 4,
  titulo: "Matemáticas 4to Grado",
  unidades: [g4u1, g4u2, g4u3, g4u4],
}

export const GRADO5: Curriculo = {
  grado: 5,
  titulo: "Matemáticas 5to Grado",
  unidades: [g5u1, g5u2, g5u3, g5u4, g5u5, g5u6],
}

export const CURRICULOS: Record<number, Curriculo> = {
  3: GRADO3,
  4: GRADO4,
  5: GRADO5,
}

export function getCurriculo(grado: number): Curriculo | null {
  return CURRICULOS[grado] ?? null
}

export function getUnidad(grado: number, unidadId: number): Unidad | null {
  const curriculo = getCurriculo(grado)
  return curriculo?.unidades.find((u) => u.id === unidadId) ?? null
}

export function getLeccion(grado: number, unidadId: number, leccionId: string): Leccion | null {
  const unidad = getUnidad(grado, unidadId)
  return unidad?.lecciones.find((l) => l.id === leccionId) ?? null
}

export function getLeccionAnteriorSiguiente(
  grado: number,
  unidadId: number,
  leccionId: string
): { anterior: Leccion | null; siguiente: Leccion | null } {
  const unidad = getUnidad(grado, unidadId)
  if (!unidad) return { anterior: null, siguiente: null }
  const idx = unidad.lecciones.findIndex((l) => l.id === leccionId)
  return {
    anterior: idx > 0 ? unidad.lecciones[idx - 1] : null,
    siguiente: idx < unidad.lecciones.length - 1 ? unidad.lecciones[idx + 1] : null,
  }
}
