"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { temasPorGrado, Grado } from "@/lib/curriculo";
import { MensajeChat } from "@/app/components/MensajeChat";

interface Msg { role: "user" | "assistant"; content: string; img?: string; reintentable?: boolean; }
interface Ejercicio { enunciado: string; pista: string; }
interface Perfil { nombre_hijo: string; grado: string; plan: string; onboarding_completado: boolean; }

const LIMITE_GRATIS = 5;

export default function TutorPage() {
  const router = useRouter();
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
  // Contador local de preguntas gratis (se resetea al recargar — la BD es la fuente de verdad para el plan)
  const preguntasRef = useRef(0);
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
      });
  }, [isLoaded, isSignedIn, router]);

  // Scroll al último mensaje
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensajes]);

  function esPro() { return perfil?.plan === "mensual" || perfil?.plan === "anual"; }

  function puedePreguntar() {
    return esPro() || preguntasRef.current < LIMITE_GRATIS;
  }

  function quedanGratis() {
    return Math.max(0, LIMITE_GRATIS - preguntasRef.current);
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
    preguntasRef.current += 1;

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
        <h1 style={{ fontSize: 28, margin: "12px 0 18px" }}>
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
