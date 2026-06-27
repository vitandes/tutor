"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { temasPorGrado, Grado } from "@/lib/curriculo";
import { MensajeChat } from "@/app/components/MensajeChat";

interface Msg { role: "user" | "assistant"; content: string; img?: string; reintentable?: boolean; }
interface Ejercicio { enunciado: string; pista: string; }
interface Perfil { nombre_hijo: string; grado: string; plan: string; onboarding_completado: boolean; }

const LIMITE_GRATIS = 5;

function TutorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useUser();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [grado, setGrado] = useState<Grado | null>(null);
  const [temaId, setTemaId] = useState<string | null>(null);
  const [temaNombre, setTemaNombre] = useState("");
  const [mensajes, setMensajes] = useState<Msg[]>([]);
  const [texto, setTexto] = useState("");
  const [img, setImg] = useState<{ data: string; tipo: string; preview: string } | null>(null);
  const [cargando, setCargando] = useState(false);
  const [muro, setMuro] = useState(false);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  // Conteo real de preguntas usadas, cargado desde la BD al montar
  const [usoReal, setUsoReal] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push("/sign-in"); return; }
    fetch("/api/perfil")
      .then((r) => r.ok ? r.json() : null)
      .then((d: Perfil | null) => {
        if (!d || !d.onboarding_completado) { router.push("/configurar"); return; }
        setPerfil(d);
        setGrado(d.grado as Grado);
        // Cargar uso real desde la BD (para evitar reset al recargar)
        if (d.plan !== "mensual" && d.plan !== "anual") {
          fetch("/api/uso").then((r) => r.json()).then((u) => {
            setUsoReal(u.uso ?? 0);
            if ((u.uso ?? 0) >= 5) setMuro(true);
          });
        }
        // Si viene desde /clases con ?tema=, lo pre-carga
        const temaParam = searchParams.get("tema");
        const contextoParam = searchParams.get("contexto");
        if (temaParam) {
          setTemaNombre(temaParam);
          setTemaId("clase-" + temaParam);
          const saludo = contextoParam
            ? `¡Hola ${d.nombre_hijo ?? ""}! Estoy aquí para ayudarte con: **${temaParam}**. ¿Qué parte no entendiste o cuál ejercicio tienes?`
            : `¡Hola ${d.nombre_hijo ?? ""}! Vamos con ${temaParam}. ¿Qué ejercicio o duda tienes?`;
          setMensajes([{ role: "assistant", content: saludo }]);
        }
      });
  }, [isLoaded, isSignedIn, router]);

  // Scroll al último mensaje
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensajes]);

  function esPro() { return perfil?.plan === "mensual" || perfil?.plan === "anual"; }

  function puedePreguntar() {
    return esPro() || usoReal < LIMITE_GRATIS;
  }

  function quedanGratis() {
    return Math.max(0, LIMITE_GRATIS - usoReal);
  }

  function elegirTema(id: string, nombre: string) {
    setTemaId(id);
    setTemaNombre(nombre);
    setMensajes([{ role: "assistant", content: `¡Hola ${perfil?.nombre_hijo ?? ""}! Vamos con ${nombre}. Cuéntame tu ejercicio o tómale una foto. ¿Qué has intentado?` }]);
    setEjercicios([]);
  }

  function leerFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      setImg({ data: r.split(",")[1], tipo: file.type, preview: r });
    };
    reader.readAsDataURL(file);
  }

  async function enviar() {
    if (!texto.trim() && !img) return;
    if (!puedePreguntar()) { setMuro(true); return; }
    const nuevo: Msg = { role: "user", content: texto.trim(), img: img?.preview };
    const historia = [...mensajes, nuevo];
    setMensajes(historia);
    setTexto("");
    const foto = img; setImg(null);
    setCargando(true);
    setUsoReal((u) => u + 1);

    // Registrar pregunta en BD (fire and forget)
    fetch("/api/progreso", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tema_id: temaId, tema_nombre: temaNombre, tipo: "pregunta" }),
    });

    try {
      const resp = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          grado, temaId,
          messages: historia.map((m) => ({ role: m.role, content: m.content })),
          imagenBase64: foto?.data, imagenTipo: foto?.tipo,
        }),
      });
      const data = await resp.json();
      if (resp.status === 403 && data.error === "limite_alcanzado") {
        setMuro(true);
        setUsoReal(data.uso ?? LIMITE_GRATIS);
        return;
      }
      const msgs: Msg[] = [];
      if (data.ejercicioExtraido) {
        msgs.push({ role: "assistant", content: `📋 Ejercicio detectado:\n${data.ejercicioExtraido}` });
      }
      const esCaida = resp.status === 503;
      msgs.push({ role: "assistant", content: data.error || data.respuesta || "Ups, intenta de nuevo.", reintentable: esCaida });
      setMensajes((m) => [...m, ...msgs]);
    } catch {
      setMensajes((m) => [...m, { role: "assistant", content: "No pude responder. Revisa tu conexión.", reintentable: true }]);
    } finally { setCargando(false); }
  }

  function logre() {
    // Registrar logro en BD (fire and forget)
    fetch("/api/progreso", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tema_id: temaId, tema_nombre: temaNombre, tipo: "logro" }),
    });
    setMensajes((m) => [...m, { role: "assistant", content: "¡Excelente! 🎉 Lo lograste tú solo. Eso es aprender de verdad." }]);
  }

  async function generarPractica() {
    setCargando(true);
    try {
      const resp = await fetch("/api/practica", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ grado, temaId }),
      });
      const data = await resp.json();
      setEjercicios(data.ejercicios || []);
    } finally { setCargando(false); }
  }

  if (!perfil || !grado) return <main className="contenedor"><p className="nota">Cargando…</p></main>;

  if (!temaId) {
    return (
      <main className="contenedor">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" className="nota">← Inicio</Link>
          <Link href="/padres" className="nota">Ver avance →</Link>
        </div>

        {/* Acceso a Clases — prominente */}
        <Link href="/clases" style={{ textDecoration: "none", display: "block", margin: "16px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "#e8f4fd", border: "2px solid #2980b9",
            borderRadius: "var(--radio)", padding: "14px 18px",
            boxShadow: "4px 4px 0 #2980b9",
            transition: "transform 0.08s, box-shadow 0.08s",
          }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translate(2px,2px)"; el.style.boxShadow = "2px 2px 0 #2980b9"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = "4px 4px 0 #2980b9"; }}
          >
            <span style={{ fontSize: 28 }}>📚</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 16, color: "#1a5276", margin: 0 }}>
                Ver clases del currículo
              </p>
              <p style={{ fontSize: 13, color: "#2980b9", margin: 0 }}>
                Lecciones organizadas por unidad · Grado {perfil.grado}
              </p>
            </div>
            <span style={{ fontSize: 20, color: "#2980b9" }}>→</span>
          </div>
        </Link>

        <h1 style={{ fontSize: 24, margin: "8px 0 14px" }}>
          {perfil.nombre_hijo}, ¿con qué <span className="marca">tema</span> necesitas ayuda?
        </h1>
        <div className="fila">
          {temasPorGrado(grado).map((t) => (
            <button key={t.id} className="chip" onClick={() => elegirTema(t.id, t.nombre)}>{t.nombre}</button>
          ))}
        </div>
        {!esPro() && (
          <p className="nota" style={{ marginTop: 20 }}>
            Plan gratuito · {quedanGratis()} preguntas restantes ·{" "}
            <Link href="/#planes" style={{ color: "var(--coral)" }}>Ver planes</Link>
          </p>
        )}
      </main>
    );
  }

  return (
    <main className="contenedor">
      <div className="fila" style={{ justifyContent: "space-between" }}>
        <button className="nota" onClick={() => setTemaId(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          ← {temaNombre}
        </button>
        <span className="racha">{esPro() ? "★ Plan activo" : `${quedanGratis()} gratis`}</span>
      </div>

      <div className="chat" ref={chatRef}>
        {mensajes.map((m, i) => (
          <div key={i} className={`burbuja ${m.role === "assistant" ? "tutor" : "nino"}`}>
            {m.img && <img src={m.img} className="thumb" alt="tarea" />}
            <MensajeChat texto={m.content} esNino={m.role === "user"} />
            {m.reintentable && (
              <button
                className="btn-reintento"
                onClick={enviar}
                disabled={cargando}
                style={{ marginTop: 8 }}
              >
                🔄 Reintentar
              </button>
            )}
          </div>
        ))}
        {cargando && <div className="burbuja tutor">Pensando…</div>}
      </div>

      {ejercicios.length > 0 && (
        <div className="tarjeta" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Practica tú</h3>
          {ejercicios.map((e, i) => (
            <div className="ejercicio" key={i}>
              <p>{e.enunciado}</p>
              <p className="pista">Pista: {e.pista}</p>
            </div>
          ))}
        </div>
      )}

      {muro ? (
        <div className="tarjeta muro">
          <h3 style={{ fontSize: 22, marginBottom: 8 }}>Se acabaron las preguntas gratis</h3>
          <p className="nota" style={{ marginBottom: 16 }}>Activa el plan para preguntas ilimitadas y el reporte de avance.</p>
          <Link href="/api/checkout?plan=mensual">
            <span className="btn coral">Activar plan mensual · $39.900/mes →</span>
          </Link>
          <br />
          <Link href="/api/checkout?plan=anual">
            <span className="btn fantasma" style={{ marginTop: 10, display: "inline-block" }}>Plan anual · $199.999/año (ahorra 58%)</span>
          </Link>
        </div>
      ) : (
        <>
          {img && <img src={img.preview} className="thumb" alt="vista previa" />}
          <div className="entrada">
            <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={leerFoto} />
            <button className="iconbtn" onClick={() => fileRef.current?.click()} title="Foto de la tarea">📷</button>
            <textarea
              rows={1}
              placeholder="Escribe lo que intentaste…"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }}
            />
            <button className="btn coral" onClick={enviar} disabled={cargando}>Enviar</button>
          </div>
          <div className="fila" style={{ marginTop: 12 }}>
            <button className="btn" onClick={logre} disabled={cargando}>¡Lo logré! 🎉</button>
            <button className="btn fantasma" onClick={generarPractica} disabled={cargando}>Dame práctica</button>
          </div>
        </>
      )}
    </main>
  );
}

export default function TutorPage() {
  return (
    <Suspense fallback={<main className="contenedor"><p className="nota">Cargando…</p></main>}>
      <TutorContent />
    </Suspense>
  );
}
