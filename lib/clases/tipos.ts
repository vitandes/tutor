export interface Paso {
  texto: string
  detalle?: string
}

export interface Ejemplo {
  enunciado: string
  pasos: Paso[]
  resultado: string
}

export interface Ejercicio {
  id: string
  enunciado: string
  tipo: "numero" | "texto" | "seleccion"
  opciones?: string[]
  respuesta: string
  pista: string
  explicacion: string
}

export interface Leccion {
  id: string            // ej: "3-1-1"  (grado-unidad-tema)
  titulo: string
  objetivo: string
  concepto_clave: string
  explicacion: string[]  // párrafos simples, uno por elemento
  ejemplos: Ejemplo[]
  ejercicios: Ejercicio[]
}

export interface Unidad {
  id: number
  nombre: string
  descripcion: string
  color: string          // clase CSS Tailwind para el color
  icono: string          // emoji
  lecciones: Leccion[]
}

export interface Curriculo {
  grado: number
  titulo: string
  unidades: Unidad[]
}
