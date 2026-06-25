import type { Unidad } from "../tipos"

const unidad2: Unidad = {
  id: 2,
  nombre: "Las Fracciones",
  descripcion: "Aprende a representar, comparar y operar partes de un entero.",
  color: "green",
  icono: "🍕",
  lecciones: [
    {
      id: "3-2-1",
      titulo: "Representación de fracciones",
      objetivo: "Identificar y representar fracciones como partes de un entero.",
      concepto_clave: "Una fracción tiene numerador (partes tomadas) y denominador (partes totales iguales).",
      explicacion: [
        "Una fracción representa una o más partes de un entero dividido en partes iguales. Si divides una pizza en 4 partes iguales y comes 1, has comido 1/4 (un cuarto) de la pizza.",
        "El número de abajo se llama DENOMINADOR y dice en cuántas partes iguales se dividió el entero. El número de arriba se llama NUMERADOR y dice cuántas partes tomamos.",
        "¡Importante! Las partes deben ser IGUALES. Si la pizza está cortada en pedazos diferentes, no podemos hablar de fracciones.",
      ],
      ejemplos: [
        {
          enunciado: "Un chocolate tiene 8 cuadros. Manuela comió 3 cuadros. ¿Qué fracción comió?",
          pasos: [
            { texto: "Total de cuadros (partes iguales): 8 → denominador" },
            { texto: "Cuadros comidos: 3 → numerador" },
            { texto: "Fracción: 3/8" },
          ],
          resultado: "Manuela comió 3/8 (tres octavos) del chocolate",
        },
        {
          enunciado: "Colorea 2/5 de una figura dividida en 5 partes iguales",
          pasos: [
            { texto: "El denominador 5 dice que hay 5 partes iguales" },
            { texto: "El numerador 2 dice que debemos colorear 2 partes" },
          ],
          resultado: "Se colorean 2 de las 5 partes iguales → ██░░░",
        },
        {
          enunciado: "¿Qué fracción del día hemos dormido si dormimos 8 horas?",
          pasos: [
            { texto: "El día tiene 24 horas → denominador = 24" },
            { texto: "Horas dormidas: 8 → numerador = 8" },
          ],
          resultado: "Dormimos 8/24 del día (ocho veinticuatroavos)",
        },
      ],
      ejercicios: [
        {
          id: "3-2-1-e1",
          enunciado: "Una naranja se divide en 6 gajos. Carlos come 4 gajos. ¿Qué fracción comió?",
          tipo: "texto",
          respuesta: "4/6",
          pista: "El denominador es el total de gajos y el numerador son los gajos comidos.",
          explicacion: "Carlos comió 4 de 6 gajos → 4/6 (cuatro sextos) de la naranja.",
        },
        {
          id: "3-2-1-e2",
          enunciado: "En la fracción 5/9, ¿cuál es el denominador?",
          tipo: "numero",
          respuesta: "9",
          pista: "El denominador es el número que está abajo de la fracción.",
          explicacion: "En 5/9, el 9 es el denominador. Nos dice que el entero está dividido en 9 partes iguales.",
        },
        {
          id: "3-2-1-e3",
          enunciado: "¿Cuál fracción representa mayor cantidad: 3/8 o 5/8?",
          tipo: "seleccion",
          opciones: ["3/8", "5/8", "Son iguales"],
          respuesta: "5/8",
          pista: "Ambas son octavos (mismo denominador). ¿Cuál tiene más partes tomadas?",
          explicacion: "Como el denominador es igual (8), comparamos numeradores: 5 > 3. Entonces 5/8 > 3/8.",
        },
        {
          id: "3-2-1-e4",
          enunciado: "¿Qué fracción es igual a un entero completo si el denominador es 7?",
          tipo: "texto",
          respuesta: "7/7",
          pista: "Si tienes TODAS las partes del entero, ¿cuántas tienes del total?",
          explicacion: "Si tienes 7 de 7 partes, tienes el entero completo: 7/7 = 1",
        },
      ],
    },
    {
      id: "3-2-2",
      titulo: "Fracción de un conjunto",
      objetivo: "Calcular la fracción de un conjunto de objetos.",
      concepto_clave: "Para hallar la fracción de un conjunto, divide el total entre el denominador y multiplica por el numerador.",
      explicacion: [
        "Las fracciones no solo se usan con figuras geométricas. También podemos hablar de fracciones de conjuntos de objetos: la fracción de una bolsa de canicas, de un grupo de estudiantes, etc.",
        "Para encontrar una fracción de un conjunto: Primero divide el total entre el denominador para saber cuántos hay en cada parte. Luego multiplica por el numerador.",
        "Ejemplo: 1/3 de 12 manzanas → 12 ÷ 3 = 4 manzanas por parte. Como queremos 1 parte: 1 × 4 = 4 manzanas.",
      ],
      ejemplos: [
        {
          enunciado: "¿Cuánto es 2/5 de 20 fichas?",
          pasos: [
            { texto: "Divido el total entre el denominador: 20 ÷ 5 = 4 fichas por parte" },
            { texto: "Multiplico por el numerador: 4 × 2 = 8 fichas" },
          ],
          resultado: "2/5 de 20 fichas = 8 fichas",
        },
        {
          enunciado: "En un salón hay 30 estudiantes. 3/6 son niñas. ¿Cuántas niñas hay?",
          pasos: [
            { texto: "30 ÷ 6 = 5 estudiantes por parte" },
            { texto: "5 × 3 = 15 niñas" },
          ],
          resultado: "Hay 15 niñas en el salón",
        },
        {
          enunciado: "Un costal tiene 24 mangos. Si 1/4 están maduros, ¿cuántos mangos maduros hay?",
          pasos: [
            { texto: "24 ÷ 4 = 6 mangos por cuarto" },
            { texto: "1 × 6 = 6 mangos maduros" },
          ],
          resultado: "Hay 6 mangos maduros",
        },
      ],
      ejercicios: [
        {
          id: "3-2-2-e1",
          enunciado: "¿Cuánto es 3/4 de 16 colores?",
          tipo: "numero",
          respuesta: "12",
          pista: "Primero 16 ÷ 4 = 4. Luego 4 × 3 = ?",
          explicacion: "16 ÷ 4 = 4 colores por parte. 4 × 3 = 12 colores.",
        },
        {
          id: "3-2-2-e2",
          enunciado: "En una clase de 35 estudiantes, 2/5 trajeron lonchera. ¿Cuántos trajeron lonchera?",
          tipo: "numero",
          respuesta: "14",
          pista: "35 ÷ 5 = 7. Luego 7 × 2 = ?",
          explicacion: "35 ÷ 5 = 7 estudiantes por parte. 7 × 2 = 14 estudiantes trajeron lonchera.",
        },
        {
          id: "3-2-2-e3",
          enunciado: "Una tienda tiene 48 arepas. Si vendió 3/8, ¿cuántas arepas vendió?",
          tipo: "numero",
          respuesta: "18",
          pista: "48 ÷ 8 = 6. Luego 6 × 3 = ?",
          explicacion: "48 ÷ 8 = 6 arepas por octavo. 6 × 3 = 18 arepas vendidas.",
        },
        {
          id: "3-2-2-e4",
          enunciado: "Si 1/3 de un conjunto es 8, ¿cuántos elementos tiene el conjunto completo?",
          tipo: "numero",
          respuesta: "24",
          pista: "Si una parte es 8, el total es 8 × 3 (el denominador).",
          explicacion: "Si 1/3 = 8, entonces el total es 8 × 3 = 24.",
        },
      ],
    },
    {
      id: "3-2-3",
      titulo: "Fracción como medida",
      objetivo: "Usar fracciones para medir longitudes y cantidades continuas.",
      concepto_clave: "Las fracciones nos ayudan a medir con precisión cuando las medidas quedan entre dos números enteros.",
      explicacion: [
        "A veces cuando medimos, el resultado no es un número exacto. Por ejemplo, una cinta puede medir más de 2 metros pero menos de 3 metros. Ahí usamos fracciones.",
        "Si dividimos 1 metro en 4 partes iguales, cada parte mide 1/4 de metro (25 centímetros).",
        "Los instrumentos de medida como la regla tienen marcas que representan fracciones de centímetro o de metro.",
      ],
      ejemplos: [
        {
          enunciado: "Una cuerda mide 2 metros y 3 cuartos. ¿Cómo se escribe como fracción?",
          pasos: [
            { texto: "2 metros enteros = 2" },
            { texto: "3 cuartos de metro = 3/4" },
            { texto: "En total: 2 y 3/4 metros" },
          ],
          resultado: "La cuerda mide 2 y 3/4 metros (número mixto)",
        },
        {
          enunciado: "Una recta de 1 cm se divide en 8 partes iguales. ¿Cuánto mide cada parte?",
          pasos: [
            { texto: "Total: 1 cm" },
            { texto: "Partes: 8" },
            { texto: "Cada parte: 1 ÷ 8 = 1/8 cm" },
          ],
          resultado: "Cada parte mide 1/8 de centímetro",
        },
      ],
      ejercicios: [
        {
          id: "3-2-3-e1",
          enunciado: "Una tira de papel mide 1 metro dividido en 10 partes iguales. ¿Cuánto mide 3 partes?",
          tipo: "texto",
          respuesta: "3/10",
          pista: "Cada parte mide 1/10 de metro. Si tomas 3 partes...",
          explicacion: "3 partes de 1/10 cada una = 3/10 de metro.",
        },
        {
          id: "3-2-3-e2",
          enunciado: "Si 1/2 metro = 50 cm, ¿cuántos centímetros es 1/4 de metro?",
          tipo: "numero",
          respuesta: "25",
          pista: "1/4 es la mitad de 1/2. Entonces es la mitad de 50 cm.",
          explicacion: "1/4 de metro = 100 cm ÷ 4 = 25 cm.",
        },
        {
          id: "3-2-3-e3",
          enunciado: "Un jugo de 1 litro se sirve en vasos de 1/3 de litro. ¿Cuántos vasos completos se pueden servir?",
          tipo: "numero",
          respuesta: "3",
          pista: "¿Cuántas veces cabe 1/3 en 1 entero?",
          explicacion: "1 ÷ (1/3) = 3. Se pueden servir 3 vasos completos.",
        },
        {
          id: "3-2-3-e4",
          enunciado: "En una recta numérica del 0 al 1 dividida en 6 partes, ¿en qué punto está 4/6?",
          tipo: "seleccion",
          opciones: ["Entre 1/2 y 1", "Exactamente en 1/2", "Entre 0 y 1/2"],
          respuesta: "Entre 1/2 y 1",
          pista: "1/2 = 3/6. Si tienes 4/6, ¿estás antes o después de 3/6?",
          explicacion: "4/6 > 3/6 = 1/2, entonces 4/6 está entre 1/2 y 1.",
        },
      ],
    },
    {
      id: "3-2-4",
      titulo: "Fracciones equivalentes",
      objetivo: "Identificar y generar fracciones equivalentes.",
      concepto_clave: "Dos fracciones son equivalentes si representan la misma cantidad aunque tengan números diferentes.",
      explicacion: [
        "Imagina que partes una pizza en 2 y te comes 1 mitad (1/2). Si la misma pizza la partes en 4 y te comes 2 partes (2/4), comiste lo mismo. ¡1/2 y 2/4 son fracciones equivalentes!",
        "Para encontrar fracciones equivalentes: multiplica o divide el numerador y el denominador por el mismo número.",
        "Ejemplo: 1/3 = 2/6 = 3/9 = 4/12. Todas representan la misma cantidad.",
      ],
      ejemplos: [
        {
          enunciado: "Encuentra dos fracciones equivalentes a 2/3",
          pasos: [
            { texto: "Multiplico por 2: (2×2)/(3×2) = 4/6" },
            { texto: "Multiplico por 3: (2×3)/(3×3) = 6/9" },
          ],
          resultado: "2/3 = 4/6 = 6/9",
        },
        {
          enunciado: "¿Son equivalentes 3/4 y 9/12?",
          pasos: [
            { texto: "Multiplico 3/4 por 3: (3×3)/(4×3) = 9/12" },
            { texto: "¡Es igual! O puedo simplificar 9/12: divido por 3 → 3/4" },
          ],
          resultado: "Sí, 3/4 y 9/12 son equivalentes",
        },
      ],
      ejercicios: [
        {
          id: "3-2-4-e1",
          enunciado: "¿Cuál fracción es equivalente a 1/2?",
          tipo: "seleccion",
          opciones: ["2/3", "3/6", "4/5", "2/5"],
          respuesta: "3/6",
          pista: "Multiplica numerador y denominador de 1/2 por el mismo número.",
          explicacion: "1/2 × (3/3) = 3/6. También 1/2 × (2/2) = 2/4, etc.",
        },
        {
          id: "3-2-4-e2",
          enunciado: "Completa: 3/5 = ?/15",
          tipo: "numero",
          respuesta: "9",
          pista: "Para pasar de 5 a 15 en el denominador, ¿por qué número multipliqué? Haz lo mismo con el numerador.",
          explicacion: "5 × 3 = 15, entonces 3 × 3 = 9. La fracción equivalente es 9/15.",
        },
        {
          id: "3-2-4-e3",
          enunciado: "Simplifica 8/12 dividiendo por 4",
          tipo: "texto",
          respuesta: "2/3",
          pista: "Divide tanto el numerador como el denominador entre 4.",
          explicacion: "8÷4 = 2 y 12÷4 = 3. La fracción simplificada es 2/3.",
        },
        {
          id: "3-2-4-e4",
          enunciado: "¿Cuántas fracciones equivalentes puedes encontrar para 1/4 multiplicando hasta por 5?",
          tipo: "numero",
          respuesta: "4",
          pista: "Multiplica 1/4 por 2, por 3, por 4 y por 5. ¿Cuántas obtienes?",
          explicacion: "2/8, 3/12, 4/16, 5/20. Son 4 fracciones equivalentes a 1/4.",
        },
      ],
    },
    {
      id: "3-2-5",
      titulo: "Comparación de fracciones",
      objetivo: "Comparar fracciones homogéneas y heterogéneas y ordenarlas.",
      concepto_clave: "Con igual denominador: gana el mayor numerador. Con igual numerador: gana el menor denominador.",
      explicacion: [
        "Para comparar fracciones con el mismo denominador (fracciones homogéneas) es fácil: la que tenga más numerador es mayor. 3/7 > 2/7 porque tomamos más partes del mismo tamaño.",
        "Para comparar fracciones con diferente denominador, podemos convertirlas a equivalentes con el mismo denominador o usar la lógica: partes más pequeñas (mayor denominador) hacen la fracción menor.",
        "Regla rápida cuando el numerador es 1: 1/2 > 1/3 > 1/4 > 1/5... porque dividir en más partes hace cada parte más pequeña.",
      ],
      ejemplos: [
        {
          enunciado: "Compara: 5/8 y 3/8",
          pasos: [
            { texto: "Mismo denominador (8): comparo numeradores" },
            { texto: "5 > 3" },
          ],
          resultado: "5/8 > 3/8",
        },
        {
          enunciado: "Compara: 1/3 y 1/5",
          pasos: [
            { texto: "Mismo numerador (1): comparo denominadores" },
            { texto: "3 < 5 → cada parte de 1/3 es más grande que cada parte de 1/5" },
          ],
          resultado: "1/3 > 1/5 (tercios son más grandes que quintos)",
        },
        {
          enunciado: "Ordena de menor a mayor: 3/10, 7/10, 1/10, 5/10",
          pasos: [
            { texto: "Mismo denominador: ordeno numeradores" },
            { texto: "1 < 3 < 5 < 7" },
          ],
          resultado: "1/10 < 3/10 < 5/10 < 7/10",
        },
      ],
      ejercicios: [
        {
          id: "3-2-5-e1",
          enunciado: "Coloca el signo correcto: 4/9 ___ 7/9",
          tipo: "seleccion",
          opciones: [">", "<", "="],
          respuesta: "<",
          pista: "Mismo denominador: compara los numeradores.",
          explicacion: "4 < 7, entonces 4/9 < 7/9.",
        },
        {
          id: "3-2-5-e2",
          enunciado: "¿Cuál es mayor: 1/4 o 1/6?",
          tipo: "seleccion",
          opciones: ["1/4", "1/6", "Son iguales"],
          respuesta: "1/4",
          pista: "Mismo numerador (1): la que tiene menor denominador representa partes más grandes.",
          explicacion: "Un cuarto (1/4) es mayor que un sexto (1/6) porque dividir en 4 partes da porciones más grandes que dividir en 6.",
        },
        {
          id: "3-2-5-e3",
          enunciado: "Ordena de mayor a menor: 2/7, 6/7, 1/7, 4/7",
          tipo: "texto",
          respuesta: "6/7,4/7,2/7,1/7",
          pista: "Todos tienen denominador 7. Ordena los numeradores de mayor a menor.",
          explicacion: "6 > 4 > 2 > 1, entonces 6/7 > 4/7 > 2/7 > 1/7.",
        },
        {
          id: "3-2-5-e4",
          enunciado: "Juan comió 3/5 de su arepa y Pedro comió 3/8 de la suya (del mismo tamaño). ¿Quién comió más?",
          tipo: "seleccion",
          opciones: ["Juan (3/5)", "Pedro (3/8)", "Comieron igual"],
          respuesta: "Juan (3/5)",
          pista: "Mismo numerador (3): el que tiene menor denominador comió partes más grandes.",
          explicacion: "3/5 > 3/8 porque quintos son más grandes que octavos (dividir en 5 partes da porciones más grandes que 8).",
        },
      ],
    },
    {
      id: "3-2-6",
      titulo: "Adición de fracciones homogéneas",
      objetivo: "Sumar fracciones con el mismo denominador.",
      concepto_clave: "Para sumar fracciones con igual denominador: suma los numeradores y conserva el denominador.",
      explicacion: [
        "Sumar fracciones con el mismo denominador es muy sencillo: solo sumamos los numeradores y dejamos el denominador igual.",
        "¿Por qué? Porque estamos sumando partes del mismo tamaño. Si tienes 2 octavos y agregas 3 octavos, tienes 5 octavos: 2/8 + 3/8 = 5/8.",
        "Si el resultado es mayor o igual que 1 (numerador ≥ denominador), podemos escribirlo como número mixto.",
      ],
      ejemplos: [
        {
          enunciado: "Calcula 3/7 + 2/7",
          pasos: [
            { texto: "Mismo denominador (7): solo sumo numeradores" },
            { texto: "3 + 2 = 5" },
            { texto: "El denominador sigue siendo 7" },
          ],
          resultado: "3/7 + 2/7 = 5/7",
        },
        {
          enunciado: "Una receta necesita 2/5 de taza de harina y 1/5 de taza de maíz. ¿Cuánto es en total?",
          pasos: [
            { texto: "2/5 + 1/5 = (2+1)/5" },
            { texto: "= 3/5" },
          ],
          resultado: "Se necesitan 3/5 de taza en total",
        },
        {
          enunciado: "Calcula 5/8 + 4/8",
          pasos: [
            { texto: "5 + 4 = 9" },
            { texto: "Resultado: 9/8" },
            { texto: "9/8 > 1: podemos escribir 1 y 1/8 (número mixto)" },
          ],
          resultado: "5/8 + 4/8 = 9/8 = 1 y 1/8",
        },
      ],
      ejercicios: [
        {
          id: "3-2-6-e1",
          enunciado: "Calcula 4/9 + 3/9",
          tipo: "texto",
          respuesta: "7/9",
          pista: "Suma los numeradores: 4 + 3. El denominador queda igual.",
          explicacion: "4/9 + 3/9 = (4+3)/9 = 7/9",
        },
        {
          id: "3-2-6-e2",
          enunciado: "De un pastel se sirvió 2/6 en el almuerzo y 1/6 en la tarde. ¿Qué fracción del pastel se consumió?",
          tipo: "texto",
          respuesta: "3/6",
          pista: "Suma las fracciones: 2/6 + 1/6",
          explicacion: "2/6 + 1/6 = 3/6 del pastel se consumió (que equivale a 1/2).",
        },
        {
          id: "3-2-6-e3",
          enunciado: "Calcula 3/5 + 4/5",
          tipo: "texto",
          respuesta: "7/5",
          pista: "¿Es el resultado mayor que 1? Si el numerador es mayor que el denominador, es más que un entero.",
          explicacion: "3/5 + 4/5 = 7/5. Como 7 > 5, es más que 1 entero. Podemos escribir 1 y 2/5.",
        },
        {
          id: "3-2-6-e4",
          enunciado: "¿Qué falta para completar 1 entero si tenemos 3/8?",
          tipo: "texto",
          respuesta: "5/8",
          pista: "1 entero = 8/8. Si ya tienes 3/8, ¿cuánto falta para llegar a 8/8?",
          explicacion: "8/8 - 3/8 = 5/8. Falta 5/8 para completar el entero.",
        },
      ],
    },
    {
      id: "3-2-7",
      titulo: "Sustracción de fracciones homogéneas",
      objetivo: "Restar fracciones con el mismo denominador.",
      concepto_clave: "Para restar fracciones con igual denominador: resta los numeradores y conserva el denominador.",
      explicacion: [
        "Restar fracciones con el mismo denominador es igual de sencillo que sumarlas: restamos los numeradores y mantenemos el denominador.",
        "7/10 - 3/10 = (7-3)/10 = 4/10. Es como tener 7 décimos y quitar 3 décimos: quedan 4 décimos.",
        "Recuerda: el numerador del primer término debe ser mayor o igual al del segundo para que el resultado sea positivo.",
      ],
      ejemplos: [
        {
          enunciado: "Calcula 6/9 - 2/9",
          pasos: [
            { texto: "Mismo denominador (9): solo resto numeradores" },
            { texto: "6 - 2 = 4" },
            { texto: "El denominador sigue siendo 9" },
          ],
          resultado: "6/9 - 2/9 = 4/9",
        },
        {
          enunciado: "Había 5/6 de jugo en una botella. Se tomaron 3/6. ¿Qué parte queda?",
          pasos: [
            { texto: "5/6 - 3/6 = (5-3)/6" },
            { texto: "= 2/6" },
          ],
          resultado: "Queda 2/6 del jugo (que equivale a 1/3)",
        },
        {
          enunciado: "Un camino mide 7/8 km. Ya recorrí 4/8 km. ¿Cuánto me falta?",
          pasos: [
            { texto: "7/8 - 4/8 = (7-4)/8" },
            { texto: "= 3/8 km" },
          ],
          resultado: "Faltan 3/8 km por recorrer",
        },
      ],
      ejercicios: [
        {
          id: "3-2-7-e1",
          enunciado: "Calcula 8/10 - 3/10",
          tipo: "texto",
          respuesta: "5/10",
          pista: "Resta los numeradores: 8 - 3. El denominador no cambia.",
          explicacion: "8/10 - 3/10 = 5/10 (que también se puede simplificar a 1/2).",
        },
        {
          id: "3-2-7-e2",
          enunciado: "Una pizza tenía 7/8. Se comieron 5/8. ¿Qué fracción queda?",
          tipo: "texto",
          respuesta: "2/8",
          pista: "Resta la parte comida de la parte inicial.",
          explicacion: "7/8 - 5/8 = 2/8 de la pizza quedó.",
        },
        {
          id: "3-2-7-e3",
          enunciado: "Calcula 9/12 - 4/12",
          tipo: "texto",
          respuesta: "5/12",
          pista: "9 - 4 = ? El denominador es 12.",
          explicacion: "9/12 - 4/12 = (9-4)/12 = 5/12",
        },
        {
          id: "3-2-7-e4",
          enunciado: "Tengo 6/7 de un rollo de cinta. Uso 2/7 para un regalo. ¿Cuánta cinta me queda?",
          tipo: "texto",
          respuesta: "4/7",
          pista: "Resta la cinta usada de la cinta total.",
          explicacion: "6/7 - 2/7 = 4/7 del rollo de cinta queda.",
        },
      ],
    },
  ],
}

export default unidad2
