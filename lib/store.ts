// Almacenamiento del MVP en el navegador.
// En PRODUCCIÓN: cuenta con login del papá + base de datos por hijo.

"use client";

export interface Cuenta {
  padre: string;
  hijo: string;
  grado: string;
}

export type Estado = "refuerzo" | "en progreso" | "dominado";

export interface ProgresoTema {
  temaId: string;
  temaNombre: string;
  preguntas: number; // veces que pidió ayuda
  resueltosSolo: number; // veces que el niño llegó solo (integridad + dominio)
  ultima: string; // ISO
}

const KEY_CUENTA = "tutor.cuenta";
const KEY_PROGRESO = "tutor.progreso";
const KEY_USADAS = "tutor.preguntasGratis";
const KEY_PRO = "tutor.suscrito";
const LIMITE_GRATIS = 5;

function leer<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function escribir(key: string, v: unknown) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(v));
}

// --- Cuenta ---
export function obtenerCuenta(): Cuenta | null {
  return leer<Cuenta | null>(KEY_CUENTA, null);
}
export function guardarCuenta(c: Cuenta) {
  escribir(KEY_CUENTA, c);
}

// --- Suscripción / muro ---
export function estaSuscrito(): boolean {
  return leer<boolean>(KEY_PRO, false);
}
export function suscribir() {
  escribir(KEY_PRO, true);
}
export function preguntasUsadas(): number {
  return leer<number>(KEY_USADAS, 0);
}
export function quedanGratis(): number {
  return Math.max(0, LIMITE_GRATIS - preguntasUsadas());
}
export function puedePreguntar(): boolean {
  return estaSuscrito() || preguntasUsadas() < LIMITE_GRATIS;
}

// --- Progreso por tema ---
function cargarProgreso(): ProgresoTema[] {
  return leer<ProgresoTema[]>(KEY_PROGRESO, []);
}

export function registrarPregunta(temaId: string, temaNombre: string) {
  if (!estaSuscrito()) escribir(KEY_USADAS, preguntasUsadas() + 1);
  const p = cargarProgreso();
  let t = p.find((x) => x.temaId === temaId);
  if (!t) {
    t = { temaId, temaNombre, preguntas: 0, resueltosSolo: 0, ultima: "" };
    p.push(t);
  }
  t.preguntas += 1;
  t.ultima = new Date().toISOString();
  escribir(KEY_PROGRESO, p);
}

// El niño marca "¡Lo logré!": señal de integridad y de dominio.
export function registrarLogro(temaId: string) {
  const p = cargarProgreso();
  const t = p.find((x) => x.temaId === temaId);
  if (t) {
    t.resueltosSolo += 1;
    t.ultima = new Date().toISOString();
    escribir(KEY_PROGRESO, p);
  }
}

export function estadoTema(t: ProgresoTema): Estado {
  if (t.resueltosSolo >= 3) return "dominado";
  if (t.resueltosSolo >= 1) return "en progreso";
  return "refuerzo";
}

export function obtenerProgreso(): ProgresoTema[] {
  return cargarProgreso();
}

export function totalResueltosSolo(): number {
  return cargarProgreso().reduce((a, t) => a + t.resueltosSolo, 0);
}
