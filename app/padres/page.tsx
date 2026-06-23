"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface ProgresoTema {
  tema_id: string;
  tema_nombre: string;
  preguntas_totales: number;
  resueltos_solo: number;
  ultima_sesion: string;
}

interface Perfil { nombre_hijo: string; grado: string; plan: string; nombre_padre: string; }

type Estado = "refuerzo" | "en progreso" | "dominado";

function estadoTema(t: ProgresoTema): Estado {
  if (t.resueltos_solo >= 3) return "dominado";
  if (t.resueltos_solo >= 1) return "en progreso";
  return "refuerzo";
}

const etiqueta: Record<Estado, string> = { dominado: "Domina", "en progreso": "En progreso", refuerzo: "Reforzar" };
const clase: Record<Estado, string> = { dominado: "dominado", "en progreso": "progreso", refuerzo: "refuerzo" };

export default function PadresPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [progreso, setProgreso] = useState<ProgresoTema[]>([]);
  const [resumen, setResumen] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push("/sign-in"); return; }
    Promise.all([
      fetch("/api/perfil").then((r) => r.ok ? r.json() : null),
      fetch("/api/progreso").then((r) => r.ok ? r.json() : []),
    ]).then(([p, prog]) => {
      if (!p || !p.onboarding_completado) { router.push("/configurar"); return; }
      setPerfil(p);
      setProgreso(prog ?? []);
    });
  }, [isLoaded, isSignedIn, router]);

  const esPro = perfil?.plan === "mensual" || perfil?.plan === "anual";
  const totalPreguntas = progreso.reduce((a, t) => a + t.preguntas_totales, 0);
  const totalLogros = progreso.reduce((a, t) => a + t.resueltos_solo, 0);

  async function generarResumen() {
    if (!perfil) return;
    setCargando(true);
    try {
      const resp = await fetch("/api/resumen", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          grado: perfil.grado,
          sesiones: progreso.map((t) => ({
            temaNombre: t.tema_nombre,
            preguntas: t.preguntas_totales,
            resueltosSolo: t.resueltos_solo,
            estado: estadoTema(t),
          })),
        }),
      });
      const data = await resp.json();
      setResumen(data.resumen || data.error || "");
    } finally { setCargando(false); }
  }

  function enviarWhatsApp() {
    const texto = encodeURIComponent(
      `📚 Avance de ${perfil?.nombre_hijo} esta semana\n\n${resumen}\n\nResolvió ${totalLogros} ejercicios por sí mismo. — Tutor de Tareas`
    );
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  }

  if (!perfil) return <main className="contenedor"><p className="nota">Cargando…</p></main>;

  return (
    <main className="contenedor">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" className="nota">← Inicio</Link>
        <Link href="/tutor" className="nota">Ir al tutor →</Link>
      </div>
      <p className="eyebrow" style={{ marginTop: 12 }}>Panel de seguimiento</p>
      <h1 style={{ fontSize: 30, margin: "8px 0 16px" }}>
        El avance de <span className="marca">{perfil.nombre_hijo}</span>
      </h1>

      {!esPro && (
        <div className="tarjeta muro" style={{ marginBottom: 20 }}>
          <p className="nota" style={{ marginBottom: 12 }}>
            El reporte completo y el resumen IA son parte del plan. Actívalo para verlo completo.
          </p>
          <Link href="/api/checkout?plan=mensual">
            <span className="btn coral">Activar plan · $39.900/mes →</span>
          </Link>
        </div>
      )}

      {/* Integridad */}
      <div className="tarjeta" style={{ marginBottom: 16, background: "var(--tinta)", color: "var(--papel)", borderColor: "var(--tinta)" }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 34, fontWeight: 700 }}>{totalLogros}</div>
        <div>ejercicios que resolvió <b>por sí mismo</b></div>
        <p className="nota" style={{ color: "#cdd6e6", marginTop: 6 }}>No le hicimos la tarea: aprendió a resolverla.</p>
      </div>

      <div className="tarjeta">
        <div className="fila" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ fontSize: 20 }}>Actividad por tema</h3>
          <span className="racha">{totalPreguntas} preguntas</span>
        </div>
        {progreso.length === 0 ? (
          <p className="nota">
            Aún no hay actividad. Cuando {perfil.nombre_hijo} use el tutor, verás aquí sus temas y su dominio.
          </p>
        ) : (
          progreso.map((t) => {
            const e = estadoTema(t);
            return (
              <div className="tema-prog" key={t.tema_id}>
                <span>{t.tema_nombre}</span>
                <span className={`badge ${clase[e]}`}>{etiqueta[e]}</span>
              </div>
            );
          })
        )}
      </div>

      {esPro && (
        <div style={{ marginTop: 20 }}>
          <button className="btn" onClick={generarResumen} disabled={cargando || progreso.length === 0}>
            {cargando ? "Generando…" : "Generar resumen semanal"}
          </button>
          {resumen && (
            <div className="tarjeta" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Resumen para ti</h3>
              <p style={{ lineHeight: 1.5, marginBottom: 14 }}>{resumen}</p>
              <button className="btn coral" onClick={enviarWhatsApp}>Enviármelo por WhatsApp</button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
