// El "foso" del producto: currículo colombiano de matemáticas, grados 3 a 5,
// mapeado a los DBA (Derechos Básicos de Aprendizaje) del MEN.
// En el MVP es un set inicial; aquí es donde tu conocimiento de educación
// se convierte en producto. Amplíalo tema por tema.

export type Grado = "3" | "4" | "5";

export interface Tema {
  id: string;
  grado: Grado;
  nombre: string;
  dba: string; // referencia al DBA
  descripcion: string; // qué debe lograr el niño
  vocabulario: string[]; // términos al nivel del grado
  erroresComunes: string[]; // pistas para que el tutor anticipe confusiones
}

export const CURRICULO: Tema[] = [
  {
    id: "3-multiplicacion",
    grado: "3",
    nombre: "Multiplicación",
    dba: "DBA 3.2",
    descripcion:
      "Comprender la multiplicación como suma repetida y resolver problemas sencillos.",
    vocabulario: ["factor", "producto", "veces", "tabla"],
    erroresComunes: [
      "Confundir multiplicar con sumar los mismos números",
      "Olvidar que el orden no cambia el producto",
    ],
  },
  {
    id: "3-division",
    grado: "3",
    nombre: "División",
    dba: "DBA 3.3",
    descripcion: "Repartir en partes iguales y entender la división como reparto.",
    vocabulario: ["dividendo", "divisor", "cociente", "repartir"],
    erroresComunes: ["Repartir cantidades desiguales", "Confundir dividendo y divisor"],
  },
  {
    id: "3-fracciones-intro",
    grado: "3",
    nombre: "Fracciones (introducción)",
    dba: "DBA 3.5",
    descripcion: "Reconocer fracciones como partes de un todo (medios, tercios, cuartos).",
    vocabulario: ["numerador", "denominador", "parte", "entero"],
    erroresComunes: ["Pensar que un denominador mayor significa fracción mayor"],
  },
  {
    id: "3-figuras",
    grado: "3",
    nombre: "Figuras geométricas",
    dba: "DBA 3.7",
    descripcion: "Identificar y clasificar figuras planas por sus lados y vértices.",
    vocabulario: ["lado", "vértice", "polígono", "ángulo"],
    erroresComunes: ["Confundir cuadrado y rectángulo"],
  },
  {
    id: "4-fracciones-operaciones",
    grado: "4",
    nombre: "Suma y resta de fracciones",
    dba: "DBA 4.4",
    descripcion: "Sumar y restar fracciones con igual denominador.",
    vocabulario: ["numerador", "denominador", "fracción equivalente"],
    erroresComunes: ["Sumar los denominadores", "No simplificar el resultado"],
  },
  {
    id: "4-decimales",
    grado: "4",
    nombre: "Números decimales",
    dba: "DBA 4.5",
    descripcion: "Leer, escribir y comparar décimas y centésimas.",
    vocabulario: ["décima", "centésima", "punto decimal", "valor posicional"],
    erroresComunes: ["Comparar decimales por la cantidad de cifras y no por su valor"],
  },
  {
    id: "4-perimetro",
    grado: "4",
    nombre: "Perímetro",
    dba: "DBA 4.7",
    descripcion: "Calcular el perímetro de figuras sumando la longitud de sus lados.",
    vocabulario: ["perímetro", "lado", "longitud", "unidad de medida"],
    erroresComunes: ["Confundir perímetro con área", "Olvidar un lado"],
  },
  {
    id: "4-problemas-multiplicativos",
    grado: "4",
    nombre: "Problemas de multiplicación y división",
    dba: "DBA 4.2",
    descripcion: "Resolver problemas que combinan multiplicación y división.",
    vocabulario: ["doble", "triple", "mitad", "tercio"],
    erroresComunes: ["No identificar qué operación pide el problema"],
  },
  {
    id: "5-fracciones-distinto-denominador",
    grado: "5",
    nombre: "Fracciones con distinto denominador",
    dba: "DBA 5.3",
    descripcion: "Sumar y restar fracciones buscando un denominador común.",
    vocabulario: ["denominador común", "amplificar", "simplificar", "equivalente"],
    erroresComunes: ["Sumar sin igualar denominadores"],
  },
  {
    id: "5-area",
    grado: "5",
    nombre: "Área de figuras",
    dba: "DBA 5.6",
    descripcion: "Calcular el área de cuadrados, rectángulos y triángulos.",
    vocabulario: ["área", "base", "altura", "unidad cuadrada"],
    erroresComunes: ["Confundir área con perímetro", "Olvidar dividir entre 2 en el triángulo"],
  },
  {
    id: "5-porcentaje",
    grado: "5",
    nombre: "Porcentajes",
    dba: "DBA 5.4",
    descripcion: "Relacionar fracciones, decimales y porcentajes en situaciones cotidianas.",
    vocabulario: ["porcentaje", "por ciento", "fracción", "decimal"],
    erroresComunes: ["No relacionar 50% con la mitad"],
  },
  {
    id: "5-graficos",
    grado: "5",
    nombre: "Tablas y gráficos",
    dba: "DBA 5.8",
    descripcion: "Leer e interpretar datos en tablas y gráficos de barras.",
    vocabulario: ["dato", "tabla", "gráfico de barras", "promedio"],
    erroresComunes: ["Leer mal el eje del gráfico"],
  },
];

export function temasPorGrado(grado: Grado): Tema[] {
  return CURRICULO.filter((t) => t.grado === grado);
}

export function buscarTema(id: string): Tema | undefined {
  return CURRICULO.find((t) => t.id === id);
}
