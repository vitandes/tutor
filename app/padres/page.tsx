"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  obtenerCuenta, Cuenta, obtenerProgreso, ProgresoTema, estadoTema,
  totalResueltosSolo, estaSuscrito, suscribir,
} from "@/lib/store";

export default function PadresPage() {
  const [cuenta, setCuenta] = useState<Cuenta | null>(null);
  const [progreso, setProgreso] = useState<ProgresoTema[]>([]);
  const [resumen, setResumen] = useState("");
  const [cargando, setCargando] = useState(false);
  const [pro, setPro] = useState(false);

  useEffect(() => {
    setCuenta(obtenerCuenta());
    setProgreso(obtenerProgreso());
    setPro(estaSuscrito());
  }, []);

  const totalPreguntas = progreso.reduce((a, t) => a + t.preguntas, 0);
  const logros = totalResueltosSolo();

  async function generarResumen() {
    setCargando(true);
    try {
      const resp = await fetch("/api/resumen", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          grado: cuenta?.grado || "4",
          sesiones: progreso.map((t) => ({
            temaNombre: t.temaNombre, preguntas: t.preguntas,
            resueltosSolo: t.resueltosSolo, estado: estadoTema(t),
          })),
        }),
      });
      const data = await resp.json();
      setResumen(data.resumen || data.error || "");
    } finally { setCargando(false); }
  }

  function enviarWhatsApp() {
    const texto = encodeURIComponent(
      `📚 Avance de ${cuenta?.hijo} esta semana\n\n${resumen}\n\nResolvió ${logros} ejercicios por sí mismo. — Tutor de Tareas`
    );
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  }

  const etiqueta: Record<string, string> = {
    dominado: "Domina", "en progreso": "En progreso", refuerzo: "Reforzar",
  };
  const clase: Record<string, string> = {
    dominado: "dominado", "en progreso": "progreso", refuerzo: "refuerzo",
  };

  return (
    <main className="contenedor">
      <Link href="/" className="nota">← Inicio</Link>
      <p className="eyebrow" style={{ marginTop: 12 }}>Panel de seguimiento</p>
      <h1 style={{ fontSize: 30, margin: "8px 0 16px" }}>
        El avance de <span className="marca">{cuenta?.hijo || "tu hijo"}</span>
      </h1>

      {!pro && (
        <div className="tarjeta muro" style={{ marginBottom: 20 }}>
          <p className="nota" style={{ marginBottom: 12 }}>El reporte de avance es parte del plan. Actívalo para verlo completo.</p>
          <button className="btn coral" onClick={() => { suscribir(); setPro(true); }}>Activar plan · $29.900/mes</button>
        </div>
      )}

      {/* Integridad: lo que ChatGPT no puede mostrar */}
      <div className="tarjeta" style={{ marginBottom: 16, background: "var(--tinta)", color: "var(--papel)", borderColor: "var(--tinta)" }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 34, fontWeight: 700 }}>{logros}</div>
        <div>ejercicios que resolvió <b>por sí mismo</b></div>
        <p className="nota" style={{ color: "#cdd6e6", marginTop: 6 }}>No le hicimos la tarea: aprendió a resolverla.</p>
      </div>

      <div className="tarjeta">
        <div className="fila" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ fontSize: 20 }}>Esta semana</h3>
          <span className="racha">{totalPreguntas} preguntas</span>
        </div>
        {progreso.length === 0 ? (
          <p className="nota">Aún no hay actividad. Cuando {cuenta?.hijo || "tu hijo"} use el tutor, verás aquí sus temas y su dominio.</p>
        ) : (
          progreso.map((t) => {
            const e = estadoTema(t);
            return (
              <div className="tema-prog" key={t.temaId}>
                <span>{t.temaNombre}</span>
                <span className={`badge ${clase[e]}`}>{etiqueta[e]}</span>
              </div>
            );
          })
        )}
      </div>

      {pro && (
        <div style={{ marginTop: 20 }}>
          <button className="btn" onClick={generarResumen} disabled={cargando || progreso.length === 0}>
            {cargando ? "Generando…" : "Generar resumen"}
          </button>
          {resumen && (
            <div className="tarjeta" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Resumen para ti</h3>
              <p style={{ lineHeight: 1.5, marginBottom: 14 }}>{resumen}</p>
              <button className="btn coral" onClick={enviarWhatsApp}>Enviármelo por WhatsApp</button>
              <p className="nota" style={{ marginTop: 10 }}>(En producción llega solo cada semana, sin que lo pidas.)</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
