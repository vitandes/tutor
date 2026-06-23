"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Configurar() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [padre, setPadre] = useState("");
  const [hijo, setHijo] = useState("");
  const [grado, setGrado] = useState("4");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Pre-llenar con nombre de Clerk si está disponible
  useEffect(() => {
    if (user?.firstName) setPadre(user.firstName);
  }, [user]);

  async function crear() {
    if (!hijo.trim()) { setError("El nombre de tu hijo es obligatorio"); return; }
    setGuardando(true);
    setError("");
    try {
      const resp = await fetch("/api/perfil", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nombre_padre: padre.trim(), nombre_hijo: hijo.trim(), grado }),
      });
      if (!resp.ok) throw new Error("Error guardando");
      router.push("/tutor");
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  if (!isLoaded) return <main className="contenedor"><p className="nota">Cargando…</p></main>;

  return (
    <main className="contenedor">
      <p className="eyebrow">Cuenta de familia</p>
      <h1 style={{ fontSize: 28, margin: "8px 0 6px" }}>
        Crea la cuenta de <span className="marca">tu familia</span>
      </h1>
      <p className="nota" style={{ marginBottom: 20 }}>
        Tú controlas la cuenta. Tu hijo solo entra a aprender.
      </p>

      <div className="tarjeta" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <label>
          <div className="nota">Tu nombre (mamá o papá)</div>
          <input
            className="campo"
            value={padre}
            onChange={(e) => setPadre(e.target.value)}
            placeholder="Ej: Carolina"
          />
        </label>
        <label>
          <div className="nota">Nombre de tu hijo *</div>
          <input
            className="campo"
            value={hijo}
            onChange={(e) => setHijo(e.target.value)}
            placeholder="Ej: Mateo"
          />
        </label>
        <label>
          <div className="nota">Grado *</div>
          <div className="fila" style={{ marginTop: 6 }}>
            {["3", "4", "5"].map((g) => (
              <button key={g} className={`chip ${grado === g ? "activo" : ""}`} onClick={() => setGrado(g)}>
                {g}°
              </button>
            ))}
          </div>
        </label>

        {error && <p className="nota" style={{ color: "var(--coral)" }}>{error}</p>}

        <button className="btn coral" onClick={crear} disabled={guardando} style={{ marginTop: 6 }}>
          {guardando ? "Guardando…" : "Crear cuenta →"}
        </button>
      </div>
    </main>
  );
}
