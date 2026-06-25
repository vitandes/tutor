import type { Curriculo, Unidad, Leccion } from "./tipos"
import unidad1 from "./grado3/unidad1"
import unidad2 from "./grado3/unidad2"
import unidad3 from "./grado3/unidad3"
import unidad4 from "./grado3/unidad4"
import unidad5 from "./grado3/unidad5"
import unidad6 from "./grado3/unidad6"

export * from "./tipos"

export const GRADO3: Curriculo = {
  grado: 3,
  titulo: "Matemáticas 3er Grado",
  unidades: [unidad1, unidad2, unidad3, unidad4, unidad5, unidad6],
}

export const CURRICULOS: Record<number, Curriculo> = {
  3: GRADO3,
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
