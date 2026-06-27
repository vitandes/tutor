import type { Unidad } from "../tipos"

const unidad2: Unidad = {
  id: 2,
  nombre: "Procedimientos de Multiplicar y Dividir",
  descripcion: "Descubre trucos mentales y métodos para multiplicar y dividir de manera rápida y eficiente.",
  color: "green",
  icono: "⚡",
  lecciones: [
    {
      id: "4-2-1",
      titulo: "Propiedad distributiva y cálculo mental",
      objetivo: "Usar la propiedad distributiva para multiplicar y dividir mentalmente números grandes.",
      concepto_clave: "Propiedad distributiva: a × (b + c) = a×b + a×c. Descompón el número difícil en partes fáciles.",
      explicacion: [
        "La PROPIEDAD DISTRIBUTIVA es uno de los trucos más poderosos en matemáticas. Nos dice que multiplicar un número por una suma es igual a multiplicar ese número por cada sumando y luego sumar.",
        "Ejemplo: 6 × 23 = 6 × (20 + 3) = 6×20 + 6×3 = 120 + 18 = 138. ¡Mucho más fácil que intentar multiplicar 6 × 23 de golpe!",
        "La DESCOMPOSICIÓN NUMÉRICA es la clave: descomponemos el número difícil en decenas y unidades (o en números más fáciles) y multiplicamos por partes.",
      ],
      ejemplos: [
        {
          enunciado: "Calcula mentalmente 7 × 45 usando la propiedad distributiva",
          pasos: [
            { texto: "Descomponemos 45 = 40 + 5" },
            { texto: "7 × 40 = 280 (7 × 4 = 28, agrego un cero)" },
            { texto: "7 × 5 = 35" },
            { texto: "280 + 35 = 315" },
          ],
          resultado: "7 × 45 = 315",
        },
        {
          enunciado: "Calcula 8 × 98 con un truco especial",
          pasos: [
            { texto: "98 está cerca de 100. Usamos: 98 = 100 − 2" },
            { texto: "8 × 100 = 800" },
            { texto: "8 × 2 = 16" },
            { texto: "800 − 16 = 784 (aquí restamos porque fue −2)" },
          ],
          resultado: "8 × 98 = 784 (¡sin calculadora!)",
        },
        {
          enunciado: "Divide mentalmente 360 ÷ 4 descomponiendo",
          pasos: [
            { texto: "Descomponemos 360 = 320 + 40" },
            { texto: "320 ÷ 4 = 80" },
            { texto: "40 ÷ 4 = 10" },
            { texto: "80 + 10 = 90" },
          ],
          resultado: "360 ÷ 4 = 90",
        },
      ],
      ejercicios: [
        {
          id: "4-2-1-e1",
          enunciado: "Usa la propiedad distributiva para calcular 6 × 34",
          tipo: "numero",
          respuesta: "204",
          pista: "34 = 30 + 4. Calcula 6×30 y 6×4 por separado.",
          explicacion: "6×30 = 180 y 6×4 = 24. Total: 180 + 24 = 204.",
        },
        {
          id: "4-2-1-e2",
          enunciado: "Calcula 9 × 99 usando el truco de 100 − 1",
          tipo: "numero",
          respuesta: "891",
          pista: "9 × 99 = 9 × (100 − 1) = 9×100 − 9×1",
          explicacion: "9×100 = 900. 9×1 = 9. 900 − 9 = 891.",
        },
        {
          id: "4-2-1-e3",
          enunciado: "Divide mentalmente 480 ÷ 6 descomponiendo",
          tipo: "numero",
          respuesta: "80",
          pista: "480 = 420 + 60. Divide cada parte entre 6.",
          explicacion: "420 ÷ 6 = 70 y 60 ÷ 6 = 10. Total: 70 + 10 = 80.",
        },
        {
          id: "4-2-1-e4",
          enunciado: "¿Por qué 5 × (20 + 3) = 5×20 + 5×3? ¿Qué propiedad es esta?",
          tipo: "texto",
          respuesta: "propiedad distributiva",
          pista: "Se llama 'distributiva' porque el número de afuera se 'distribuye' entre los sumandos.",
          explicacion: "Es la propiedad distributiva. Nos permite descomponer multiplicaciones complejas en partes más simples.",
        },
      ],
    },
    {
      id: "4-2-2",
      titulo: "Trucos para las tablas de multiplicar",
      objetivo: "Aplicar trucos mentales para multiplicar rápidamente usando duplicación, mitad y otras estrategias.",
      concepto_clave: "Trucos clave: ×2 = duplicar, ×4 = duplicar dos veces, ×5 = mitad de ×10, ×9 = ×10 − 1 vez.",
      explicacion: [
        "No necesitas memorizar todo de memoria si conoces los TRUCOS. Son conexiones entre las tablas que hacen el cálculo más rápido.",
        "TRUCOS PRINCIPALES: Para ×2 duplica el número. Para ×4 duplica dos veces (duplica y vuelve a duplicar). Para ×8 duplica tres veces. Para ×5 calcula ×10 y divide entre 2. Para ×9 calcula ×10 y resta una vez el número.",
        "TRUCO ESPECIAL PARA ×9 con los dedos: extiende las 10 manos, dobla el dedo que corresponde al número. Los dedos a la izquierda son las decenas, los de la derecha las unidades.",
      ],
      ejemplos: [
        {
          enunciado: "Calcula 7 × 4 usando el truco de 'duplicar dos veces'",
          pasos: [
            { texto: "×4 = ×2 × ×2 (duplicar y volver a duplicar)" },
            { texto: "7 × 2 = 14 (primera duplicación)" },
            { texto: "14 × 2 = 28 (segunda duplicación)" },
          ],
          resultado: "7 × 4 = 28",
        },
        {
          enunciado: "Calcula 13 × 5 con el truco de ×5",
          pasos: [
            { texto: "×5 = mitad de ×10" },
            { texto: "13 × 10 = 130" },
            { texto: "130 ÷ 2 = 65" },
          ],
          resultado: "13 × 5 = 65",
        },
        {
          enunciado: "Calcula 8 × 9 con el truco de ×9",
          pasos: [
            { texto: "×9 = ×10 − ×1" },
            { texto: "8 × 10 = 80" },
            { texto: "8 × 1 = 8" },
            { texto: "80 − 8 = 72" },
          ],
          resultado: "8 × 9 = 72",
        },
      ],
      ejercicios: [
        {
          id: "4-2-2-e1",
          enunciado: "Calcula 6 × 8 usando el truco de 'duplicar tres veces'",
          tipo: "numero",
          respuesta: "48",
          pista: "×8 = duplicar tres veces. Empieza: 6 × 2 = 12. Luego 12 × 2. Luego ese resultado × 2.",
          explicacion: "6×2=12, 12×2=24, 24×2=48. El truco: ×8 siempre es duplicar tres veces.",
        },
        {
          id: "4-2-2-e2",
          enunciado: "Usa el truco de ×5 para calcular 18 × 5",
          tipo: "numero",
          respuesta: "90",
          pista: "18 × 10 = 180. Luego divide entre 2.",
          explicacion: "18 × 10 = 180. 180 ÷ 2 = 90. El truco ×5 siempre da el mismo resultado.",
        },
        {
          id: "4-2-2-e3",
          enunciado: "Calcula 7 × 9 con el truco ×9 = ×10 − ×1",
          tipo: "numero",
          respuesta: "63",
          pista: "7 × 10 = 70. Luego resta 7 × 1.",
          explicacion: "7×10=70. 70−7=63. Truco rápido para el 9.",
        },
        {
          id: "4-2-2-e4",
          enunciado: "¿Cuál truco es más fácil para calcular 12 × 4: 'duplicar dos veces' o la suma 12+12+12+12?",
          tipo: "seleccion",
          opciones: ["Duplicar dos veces (12→24→48)", "La suma repetida (12+12+12+12)", "Son igual de fáciles"],
          respuesta: "Duplicar dos veces (12→24→48)",
          pista: "Compara cuántos pasos tiene cada método.",
          explicacion: "Duplicar dos veces es más rápido: 12×2=24, 24×2=48 (solo 2 pasos). La suma requiere sumar 4 veces.",
        },
      ],
    },
    {
      id: "4-2-3",
      titulo: "El ábaco y operaciones en columnas",
      objetivo: "Usar el ábaco como modelo para comprender las operaciones y reforzar el algoritmo escrito.",
      concepto_clave: "El ábaco representa cada posición con cuentas. Sumar es agregar cuentas; restar es quitarlas.",
      explicacion: [
        "El ÁBACO es uno de los instrumentos de cálculo más antiguos del mundo. Tiene varillas o columnas y en cada una se colocan cuentas que representan las unidades, decenas, centenas, etc.",
        "Cuando sumamos con ábaco: agregamos las cuentas del número a sumar en cada columna. Si hay 10 o más cuentas en una columna, 'llevamos' una cuenta a la columna siguiente (igual que el algoritmo escrito).",
        "El ábaco nos ayuda a VISUALIZAR por qué los algoritmos funcionan. Cada 'llevada' en una suma o cada 'prestado' en una resta tiene un significado físico en el ábaco.",
      ],
      ejemplos: [
        {
          enunciado: "Suma 347 + 285 en ábaco (por columnas)",
          pasos: [
            { texto: "Unidades: 7 + 5 = 12 → escribo 2, llevo 1 a decenas" },
            { texto: "Decenas: 4 + 8 + 1(llevado) = 13 → escribo 3, llevo 1 a centenas" },
            { texto: "Centenas: 3 + 2 + 1(llevado) = 6 → escribo 6" },
          ],
          resultado: "347 + 285 = 632",
        },
        {
          enunciado: "Multiplica 243 × 3 en columnas",
          pasos: [
            { texto: "3 × 3 = 9 (unidades)" },
            { texto: "3 × 4 = 12 → escribo 2, llevo 1 (decenas)" },
            { texto: "3 × 2 = 6 + 1(llevado) = 7 (centenas)" },
          ],
          resultado: "243 × 3 = 729",
        },
      ],
      ejercicios: [
        {
          id: "4-2-3-e1",
          enunciado: "Calcula en columnas: 4.328 × 6",
          tipo: "numero",
          respuesta: "25968",
          pista: "Multiplica cifra por cifra desde las unidades. Recuerda llevar cuando el resultado supera 9.",
          explicacion: "8×6=48(escribe 8 lleva 4), 2×6+4=16(escribe 6 lleva 1), 3×6+1=19(escribe 9 lleva 1), 4×6+1=25. Resultado: 25.968.",
        },
        {
          id: "4-2-3-e2",
          enunciado: "En un ábaco, si hay 15 cuentas en la columna de las unidades, ¿qué hacemos?",
          tipo: "seleccion",
          opciones: [
            "Dejamos las 15 cuentas ahí",
            "Quitamos 10 cuentas y pasamos 1 a las decenas",
            "Borramos todas y empezamos de nuevo",
          ],
          respuesta: "Quitamos 10 cuentas y pasamos 1 a las decenas",
          pista: "10 unidades forman 1 decena. ¿Qué hacemos con esas 10?",
          explicacion: "10 unidades = 1 decena. Quitamos 10 cuentas de unidades y ponemos 1 en decenas. Quedan 5 en unidades.",
        },
        {
          id: "4-2-3-e3",
          enunciado: "Calcula 1.256 × 4",
          tipo: "numero",
          respuesta: "5024",
          pista: "Empieza por las unidades: 6×4=24 (escribe 4, lleva 2).",
          explicacion: "6×4=24(4 lleva 2), 5×4+2=22(2 lleva 2), 2×4+2=10(0 lleva 1), 1×4+1=5. Resultado: 5.024.",
        },
        {
          id: "4-2-3-e4",
          enunciado: "¿Por qué el ábaco ayuda a entender las matemáticas mejor que solo usar papel?",
          tipo: "texto",
          respuesta: "Porque permite ver y tocar las cantidades, haciendo visibles las llevadas y los grupos",
          pista: "Piensa en la diferencia entre ver un número escrito y mover cuentas físicamente.",
          explicacion: "El ábaco hace visible y tangible lo que en papel es abstracto. Las llevadas y reagrupaciones se convierten en acciones físicas comprensibles.",
        },
      ],
    },
    {
      id: "4-2-4",
      titulo: "Unidades de capacidad: litro y mililitro",
      objetivo: "Convertir entre litros y mililitros y resolver problemas de capacidad.",
      concepto_clave: "1 litro (L) = 1.000 mililitros (mL). Para convertir L→mL multiplica por 1.000; mL→L divide entre 1.000.",
      explicacion: [
        "La CAPACIDAD mide cuánto líquido cabe en un recipiente. Las dos unidades principales que usaremos son el LITRO (L) y el MILILITRO (mL).",
        "1 litro = 1.000 mililitros. Una botella de agua pequeña tiene 500 mL (medio litro). Un vaso tiene unos 250 mL (un cuarto de litro). Una cuchara sopera tiene unos 15 mL.",
        "En Colombia, los líquidos se venden en litros y mililitros: leche en bolsas de 1.100 mL, refrescos en botellas de 1,5 L, etc.",
      ],
      ejemplos: [
        {
          enunciado: "Convierte 3,5 L a mL",
          pasos: [
            { texto: "1 L = 1.000 mL" },
            { texto: "3,5 L = 3,5 × 1.000 mL" },
          ],
          resultado: "3,5 L = 3.500 mL",
        },
        {
          enunciado: "Una receta necesita 750 mL de leche. ¿Cuántos litros completos necesito comprar?",
          pasos: [
            { texto: "750 mL < 1.000 mL (menos de 1 L)" },
            { texto: "Necesito comprar al menos 1 bolsa de 1 L (1.000 mL)" },
            { texto: "Sobrarán 1.000 − 750 = 250 mL" },
          ],
          resultado: "Necesito 1 litro; sobrarán 250 mL",
        },
      ],
      ejercicios: [
        {
          id: "4-2-4-e1",
          enunciado: "¿Cuántos mL tiene 4 L?",
          tipo: "numero",
          respuesta: "4000",
          pista: "1 L = 1.000 mL. Multiplica 4 × 1.000.",
          explicacion: "4 L × 1.000 = 4.000 mL.",
        },
        {
          id: "4-2-4-e2",
          enunciado: "¿Cuántos vasos de 250 mL caben en una botella de 2 L?",
          tipo: "numero",
          respuesta: "8",
          pista: "Primero convierte 2 L a mL, luego divide.",
          explicacion: "2 L = 2.000 mL. 2.000 ÷ 250 = 8 vasos.",
        },
        {
          id: "4-2-4-e3",
          enunciado: "Una botella tiene 1.500 mL. ¿Cuántos litros y mililitros son?",
          tipo: "texto",
          respuesta: "1 litro y 500 mililitros",
          pista: "1.500 = 1.000 + 500. El primer grupo es 1 litro.",
          explicacion: "1.500 mL = 1.000 mL + 500 mL = 1 L y 500 mL (litro y medio).",
        },
        {
          id: "4-2-4-e4",
          enunciado: "Para una fiesta se necesitan 5 L de jugo. Si cada bolsa tiene 250 mL, ¿cuántas bolsas se compran?",
          tipo: "numero",
          respuesta: "20",
          pista: "5 L = 5.000 mL. ¿Cuántas veces cabe 250 en 5.000?",
          explicacion: "5.000 ÷ 250 = 20 bolsas de jugo.",
        },
      ],
    },
  ],
}

export default unidad2
