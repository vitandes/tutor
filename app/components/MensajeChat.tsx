// Renderiza un mensaje del chat con fracciones visuales y pasos destacados.

import React from "react";

// Detecta patrones: número/número  (ej: 1/4, 12/6, 100/3)
const FRACCION = /\b(\d+)\/(\d+)\b/g;

// Iconos de pasos que el prompt usa
const PASO_ICONS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

interface Segmento {
  tipo: "texto" | "fraccion" | "paso" | "ruta" | "inicio" | "confirmacion";
  texto?: string;
  num?: string;
  den?: string;
}

function parsear(texto: string): Segmento[] {
  const resultado: Segmento[] = [];
  const lineas = texto.split("\n");

  for (const linea of lineas) {
    // Línea de ruta (🗺️ **)
    if (linea.startsWith("🗺️")) {
      resultado.push({ tipo: "ruta", texto: linea.replace(/🗺️\s?\*?\*?Ruta:\*?\*?\s?/, "").replace(/\*\*/g, "").trim() });
      resultado.push({ tipo: "texto", texto: "\n" });
      continue;
    }

    // Línea de inicio de paso (📍 **)
    if (linea.startsWith("📍")) {
      resultado.push({ tipo: "inicio", texto: linea.replace("📍", "").replace(/\*\*/g, "").trim() });
      resultado.push({ tipo: "texto", texto: "\n" });
      continue;
    }

    // Línea de confirmación ✅
    if (linea.startsWith("✅")) {
      resultado.push({ tipo: "confirmacion", texto: linea.replace("✅", "").trim() });
      resultado.push({ tipo: "texto", texto: "\n" });
      continue;
    }

    // Línea de paso numerado (1️⃣ 2️⃣ ...)
    const esPaso = PASO_ICONS.findIndex((ic) => linea.startsWith(ic));
    if (esPaso >= 0) {
      resultado.push({ tipo: "paso", texto: linea.replace(PASO_ICONS[esPaso], "").trim(), num: String(esPaso + 1) });
      resultado.push({ tipo: "texto", texto: "\n" });
      continue;
    }

    // Línea normal: buscar fracciones dentro
    const partes = parsearFracciones(linea.replace(/\*\*/g, ""));
    resultado.push(...partes);
    resultado.push({ tipo: "texto", texto: "\n" });
  }

  return resultado;
}

function parsearFracciones(linea: string): Segmento[] {
  const segs: Segmento[] = [];
  let ultimo = 0;
  let m: RegExpExecArray | null;
  FRACCION.lastIndex = 0;

  while ((m = FRACCION.exec(linea)) !== null) {
    if (m.index > ultimo) segs.push({ tipo: "texto", texto: linea.slice(ultimo, m.index) });
    segs.push({ tipo: "fraccion", num: m[1], den: m[2] });
    ultimo = m.index + m[0].length;
  }
  if (ultimo < linea.length) segs.push({ tipo: "texto", texto: linea.slice(ultimo) });
  return segs;
}

export function MensajeChat({ texto, esNino }: { texto: string; esNino: boolean }) {
  if (esNino) return <span>{texto}</span>;

  const segmentos = parsear(texto);

  return (
    <span>
      {segmentos.map((s, i) => {
        switch (s.tipo) {
          case "fraccion":
            return (
              <span key={i} className="fraccion" aria-label={`${s.num} sobre ${s.den}`}>
                <span className="frac-num">{s.num}</span>
                <span className="frac-den">{s.den}</span>
              </span>
            );
          case "ruta":
            return (
              <span key={i} className="chat-ruta">
                🗺️ Ruta: <strong>{s.texto}</strong>
              </span>
            );
          case "paso":
            return (
              <span key={i} className="chat-paso">
                <span className="chat-paso-num">{s.num}</span>
                <span>{s.texto}</span>
              </span>
            );
          case "inicio":
            return (
              <span key={i} className="chat-inicio">
                📍 {s.texto}
              </span>
            );
          case "confirmacion":
            return (
              <span key={i} className="chat-ok">
                ✅ {s.texto}
              </span>
            );
          default:
            return s.texto === "\n" ? <br key={i} /> : <span key={i}>{s.texto}</span>;
        }
      })}
    </span>
  );
}
