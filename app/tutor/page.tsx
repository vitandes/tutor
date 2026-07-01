"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { temasPorGrado, Grado } from "@/lib/curriculo";
import { MensajeChat } from "@/app/components/MensajeChat";

interface Msg { role: "user" | "assistant"; content: string; img?: string; reintentable?: boolean; }
interface Ejercicio { enunciado: string; pista: string; }
interface Perfil { nombre_hijo: string; grado: string; plan: string; onboarding_completado: boolean; imagenes_hoy: number; imagenes_fecha: string | null; }

const LIMITE_FOTOS_DIA = 5;

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
  const fileRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [fotosHoy, setFotosHoy] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push("/sign-in"); return; }
    fetch("/api/perfil")
      .then((r) => r.ok ? r.json() : null)
      .then((d: Perfil | null) => {
        if (!d || !d.onboarding_completado) { router.push("/configurar"); return; }
        setPerfil(d);
        setGrado(d.grado as Grado);
        // Cargar fotos usadas hoy (resetear si es día nuevo)
        const hoy = new Date().toISOString().slice(0, 10);
        setFotosHoy(d.imagenes_fecha === hoy ? (d.imagenes_hoy ?? 0) : 0);
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

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensajes]);

  function esPro() { return perfil?.plan === "mensual" || perfil?.plan === "anual"; }

  function elegirTema(id: string, nombre: string) {
    setTemaId(id);
    setTemaNombre(nombre);
    const saludo = id === "libre"
      ? `¡Hola ${perfil?.nombre_hijo ?? ""}! Cuéntame qué tema o ejercicio necesitas resolver hoy. Puedes escribirlo o tomarle una foto. 📸`
      : `¡Hola ${perfil?.nombre_hijo ?? ""}! Vamos con ${nombre}. Cuéntame tu ejercicio o tómale una foto. ¿Qué has intentado?`;
    setMensajes([{ role: "assistant", content: saludo }]);
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
    const nuevo: Msg = { role: "user", content: texto.trim(), img: img?.preview };
    const historia = [...mensajes, nuevo];
    setMensajes(historia);
    setTexto("");
    const foto = img; setImg(null);
    setCargando(true);

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

      // Límite de fotos diarias alcanzado
      if (resp.status === 429 && data.error === "limite_fotos") {
        setMensajes((m) => [...m, {
          role: "assistant",
          content: `📷 Ya usaste las ${LIMITE_FOTOS_DIA} fotos de hoy. Mañana se renueva el límite. Mientras, puedes escribir el ejercicio con texto y te ayudo igual. ✍️`,
        }]);
        setFotosHoy(LIMITE_FOTOS_DIA);
        return;
      }

      // Actualizar contador de fotos si vino en la respuesta
      if (data.fotosHoy !== undefined) setFotosHoy(data.fotosHoy);

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

  // Paywall si no tiene plan activo
  if (!esPro()) {
    return (
      <main className="contenedor">
        <Link href="/" className="nota">← Inicio</Link>
        <div className="tarjeta" style={{ textAlign: "center", padding: "48px 24px", marginTop: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎁</div>
          <div style={{
            display: "inline-block",
            background: "var(--marcador)",
            border: "2px solid var(--tinta)",
            borderRadius: 10,
            padding: "6px 16px",
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 16,
          }}>
            3 días de prueba gratis — sin cobro hasta que terminen
          </div>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Empieza hoy sin pagar nada</h2>
          <p className="nota" style={{ maxWidth: 400, margin: "0 auto 28px" }}>
            Elige un plan, ingresa tu tarjeta y accede a todo: tutor ilimitado, clases del currículo y seguimiento de progreso.
            <strong> No se hace ningún cobro durante los primeros 3 días.</strong>
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "0 auto" }}>
            <Link href="/api/checkout?plan=mensual" className="btn coral" style={{ display: "block", padding: "14px 20px" }}>
              Probar gratis · luego $39.900/mes →
            </Link>
            <Link href="/api/checkout?plan=anual" className="btn fantasma" style={{ display: "block", padding: "14px 20px" }}>
              Probar gratis · luego $199.999/año (ahorra 58%)
            </Link>
          </div>

          <p style={{ marginTop: 20, fontSize: 12, color: "var(--gris)" }}>
            💳 Cancela antes de los 3 días y no pagas nada · Sin permanencia
          </p>
        </div>
      </main>
    );
  }

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

        <div style={{ marginTop: 24, borderTop: "2px dashed var(--linea)", paddingTop: 20 }}>
          <p className="nota" style={{ marginBottom: 12 }}>¿Tu tema no aparece arriba?</p>
          <button
            className="btn fantasma"
            onClick={() => elegirTema("libre", "otro tema")}
            style={{ width: "100%" }}
          >
            📝 Estudiar otro tema con el tutor
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="contenedor">
      <div className="fila" style={{ justifyContent: "space-between" }}>
        <button className="nota" onClick={() => setTemaId(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          ← {temaNombre}
        </button>
        <span className="racha">★ Plan activo</span>
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

      <>
        {img && <img src={img.preview} className="thumb" alt="vista previa" />}
        <div className="entrada">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={leerFoto} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button
              className="iconbtn"
              onClick={() => fileRef.current?.click()}
              title={fotosHoy >= LIMITE_FOTOS_DIA ? "Límite de fotos alcanzado" : "Foto de la tarea"}
              disabled={fotosHoy >= LIMITE_FOTOS_DIA}
              style={{ opacity: fotosHoy >= LIMITE_FOTOS_DIA ? 0.4 : 1 }}
            >
              📷
            </button>
            <span style={{ fontSize: 10, color: fotosHoy >= LIMITE_FOTOS_DIA ? "var(--coral)" : "var(--gris)", fontWeight: 600, lineHeight: 1 }}>
              {LIMITE_FOTOS_DIA - fotosHoy}/{LIMITE_FOTOS_DIA}
            </span>
          </div>
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
