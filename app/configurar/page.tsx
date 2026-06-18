"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { guardarCuenta } from "@/lib/store";

export default function Configurar() {
  const router = useRouter();
  const [padre, setPadre] = useState("");
  const [hijo, setHijo] = useState("");
  const [grado, setGrado] = useState("4");

  function crear() {
    if (!padre.trim() || !hijo.trim()) return;
    guardarCuenta({ padre: padre.trim(), hijo: hijo.trim(), grado });
    router.push("/");
  }

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
          <input className="campo" value={padre} onChange={(e) => setPadre(e.target.value)} placeholder="Ej: Carolina" />
        </label>
        <label>
          <div className="nota">Nombre de tu hijo</div>
          <input className="campo" value={hijo} onChange={(e) => setHijo(e.target.value)} placeholder="Ej: Mateo" />
        </label>
        <label>
          <div className="nota">Grado</div>
          <div className="fila" style={{ marginTop: 6 }}>
            {["3", "4", "5"].map((g) => (
              <button key={g} className={`chip ${grado === g ? "activo" : ""}`} onClick={() => setGrado(g)}>
                {g}°
              </button>
            ))}
          </div>
        </label>
        <button className="btn coral" onClick={crear} style={{ marginTop: 6 }}>
          Crear cuenta
        </button>
      </div>
    </main>
  );
}
