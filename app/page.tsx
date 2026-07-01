"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

interface Perfil {
  nombre_hijo: string;
  grado: string;
  plan: string;
}

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setPerfil(null);
      return;
    }
    fetch("/api/perfil")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d?.onboarding_completado ? setPerfil(d) : setPerfil(null)))
      .catch(() => setPerfil(null));
  }, [isSignedIn]);

  const esPro = perfil?.plan === "mensual" || perfil?.plan === "anual";

  // Dashboard para usuarios con plan activo
  if (isSignedIn && perfil && esPro) {
    return (
      <main className="contenedor">
        <p className="eyebrow">Bienvenido/a, {user?.firstName ?? "familia"}</p>
        <h1 style={{ fontSize: 32, margin: "8px 0 6px" }}>
          ¿Qué hace hoy <span className="marca">{perfil.nombre_hijo}</span>?
        </h1>
        <p className="nota" style={{ marginBottom: 32 }}>
          Grado {perfil.grado} · Plan activo ★
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Clases */}
          <Link href="/clases" style={{ textDecoration: "none" }}>
            <div
              className="tarjeta"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: "#e8f4fd",
                border: "2px solid #2980b9",
                boxShadow: "4px 4px 0 #2980b9",
                cursor: "pointer",
                transition: "transform 0.08s, box-shadow 0.08s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translate(2px,2px)";
                el.style.boxShadow = "2px 2px 0 #2980b9";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "";
                el.style.boxShadow = "4px 4px 0 #2980b9";
              }}
            >
              <div style={{ fontSize: 40, lineHeight: 1 }}>📚</div>
              <div style={{ flex: 1 }}>
                <h2
                  style={{ fontSize: 20, margin: "0 0 4px", color: "#1a5276" }}
                >
                  Clases
                </h2>
                <p style={{ fontSize: 14, color: "#2980b9", margin: 0 }}>
                  Lecciones del currículo · Grado {perfil.grado} · Aprende paso
                  a paso
                </p>
              </div>
              <div style={{ fontSize: 24, color: "#2980b9" }}>→</div>
            </div>
          </Link>

          {/* Tutor */}
          <Link href="/tutor" style={{ textDecoration: "none" }}>
            <div
              className="tarjeta"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: "#fef9e7",
                border: "2px solid var(--coral)",
                boxShadow: "4px 4px 0 var(--coral)",
                cursor: "pointer",
                transition: "transform 0.08s, box-shadow 0.08s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translate(2px,2px)";
                el.style.boxShadow = "2px 2px 0 var(--coral)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "";
                el.style.boxShadow = "4px 4px 0 var(--coral)";
              }}
            >
              <div style={{ fontSize: 40, lineHeight: 1 }}>🤖</div>
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: 20,
                    margin: "0 0 4px",
                    color: "var(--tinta)",
                  }}
                >
                  Tutor de tareas
                </h2>
                <p style={{ fontSize: 14, color: "var(--gris)", margin: 0 }}>
                  Sube la tarea o pregunta lo que no entiende · Pistas sin dar
                  la respuesta
                </p>
              </div>
              <div style={{ fontSize: 24, color: "var(--coral)" }}>→</div>
            </div>
          </Link>

          {/* Ver avance */}
          <Link href="/padres" style={{ textDecoration: "none" }}>
            <div
              className="tarjeta"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: "#eafaf1",
                border: "2px solid #27ae60",
                boxShadow: "4px 4px 0 #27ae60",
                cursor: "pointer",
                transition: "transform 0.08s, box-shadow 0.08s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translate(2px,2px)";
                el.style.boxShadow = "2px 2px 0 #27ae60";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "";
                el.style.boxShadow = "4px 4px 0 #27ae60";
              }}
            >
              <div style={{ fontSize: 40, lineHeight: 1 }}>📊</div>
              <div style={{ flex: 1 }}>
                <h2
                  style={{ fontSize: 20, margin: "0 0 4px", color: "#1e8449" }}
                >
                  Ver avance
                </h2>
                <p style={{ fontSize: 14, color: "#27ae60", margin: 0 }}>
                  Qué temas practicó, qué domina y qué necesita reforzar
                </p>
              </div>
              <div style={{ fontSize: 24, color: "#27ae60" }}>→</div>
            </div>
          </Link>
        </div>

        <p className="pie" style={{ marginTop: 40 }}>
          Tutor de Tareas · Matemáticas de primaria 💛
        </p>
      </main>
    );
  }

  return (
    <main className="contenedor">
      {/* ====== HERO ====== */}
      <p className="eyebrow">Matemáticas · 3°, 4° y 5° de primaria</p>
      <h1 style={{ fontSize: 40, margin: "10px 0 16px" }}>
        Tu hijo entiende la tarea <span className="marca">paso a paso</span>.
      </h1>
      <p
        className="nota"
        style={{ fontSize: 18, maxWidth: 520, color: "var(--tinta)" }}
      >
        No le damos la respuesta: lo guiamos a descubrirla, como un buen profe.
        Y tú ves desde tu celular en qué va mejorando y qué le cuesta.
      </p>

      {!isSignedIn ? (
        <div className="fila cta-hero" style={{ marginTop: 28 }}>
          <SignUpButton forceRedirectUrl="/configurar">
            <button className="btn coral">Crear cuenta de familia →</button>
          </SignUpButton>
          <a href="#planes">
            <span className="btn fantasma">Ver planes</span>
          </a>
        </div>
      ) : perfil ? (
        <>
          <p
            style={{
              marginTop: 24,
              fontFamily: "var(--display)",
              fontWeight: 600,
            }}
          >
            Hola, {user?.firstName ?? "familia"} 👋
          </p>
          <div className="fila cta-hero" style={{ marginTop: 12, gap: 16 }}>
            <Link href="/clases">
              <span className="btn coral">📚 Ir a Clases →</span>
            </Link>
            <Link href="/tutor">
              <span className="btn fantasma">🤖 Consultar tutor →</span>
            </Link>
          </div>
        </>
      ) : (
        <>
          <p
            style={{
              marginTop: 24,
              fontFamily: "var(--display)",
              fontWeight: 600,
            }}
          >
            Hola, {user?.firstName ?? "familia"} 👋 — falta un paso
          </p>
          <div className="fila cta-hero" style={{ marginTop: 12, gap: 16 }}>
            <Link href="/configurar">
              <span className="btn coral">Completar configuración →</span>
            </Link>
          </div>
        </>
      )}

      <div className="confianza">
        <span>👨‍👩‍👧 +2.000 familias</span>
        <span>⭐ 4.9/5 valoración</span>
        <span>🔒 Sin publicidad ni chats externos</span>
        <span>🎁 Días de prueba incluidos</span>
      </div>

      {/* ====== ESTADÍSTICAS ====== */}
      <div className="stats">
        <div className="stat">
          <div className="num">
            15<span className="unidad"> min</span>
          </div>
          <div className="txt">de estudio guiado al día bastan</div>
        </div>
        <div className="stat">
          <div className="num">+38%</div>
          <div className="txt">mejora en notas tras 2 meses*</div>
        </div>
        <div className="stat">
          <div className="num">0</div>
          <div className="txt">respuestas regaladas: siempre razona</div>
        </div>
      </div>

      {/* ====== EL PROBLEMA ====== */}
      <section className="seccion">
        <h2 className="seccion-titulo">¿Te suena esto?</h2>
        <p className="seccion-intro">
          La hora de la tarea no debería terminar en lágrimas ni en peleas.
          Tampoco en copiar respuestas de internet sin entender nada.
        </p>
        <div className="rejilla">
          <div className="beneficio">
            <span className="emoji">😣</span>
            <h4>"No sé cómo explicarle"</h4>
            <p>
              Las mates de hoy se enseñan distinto a como las aprendiste tú.
              Acabáis los dos frustrados.
            </p>
          </div>
          <div className="beneficio">
            <span className="emoji">⏰</span>
            <h4>"No tengo tiempo cada tarde"</h4>
            <p>
              Entre el trabajo y la casa es imposible sentarse una hora a
              revisar cada ejercicio.
            </p>
          </div>
          <div className="beneficio">
            <span className="emoji">📱</span>
            <h4>"Copia la respuesta y ya"</h4>
            <p>
              Las apps que dan el resultado hecho no enseñan: tu hijo aprueba el
              examen pero no aprende.
            </p>
          </div>
          <div className="beneficio">
            <span className="emoji">🤷</span>
            <h4>"No sé en qué falla"</h4>
            <p>
              Te enteras de que algo va mal cuando llega la nota, y ya es tarde
              para reforzar.
            </p>
          </div>
        </div>
      </section>

      {/* ====== CÓMO FUNCIONA ====== */}
      <section className="seccion">
        <h2 className="seccion-titulo">Cómo funciona</h2>
        <p className="seccion-intro">
          Pensado para que tu hijo lo use solo, en menos de un minuto, sin que
          tengas que estar encima.
        </p>
        <div className="tarjeta">
          <div className="paso">
            <div className="nro">1</div>
            <div>
              <h4>Sube la tarea</h4>
              <p>
                El niño toma una foto de la tarea o escribe la pregunta que no
                entiende.
              </p>
            </div>
          </div>
          <div className="paso">
            <div className="nro">2</div>
            <div>
              <h4>El tutor lo guía con pistas</h4>
              <p>
                Le hace preguntas y le da pistas para que llegue solo a la
                respuesta. Nunca se la regala.
              </p>
            </div>
          </div>
          <div className="paso">
            <div className="nro">3</div>
            <div>
              <h4>Practica hasta dominarlo</h4>
              <p>
                Cuando entiende, marca "¡Lo logré!" y resuelve ejercicios
                similares para afianzar el tema.
              </p>
            </div>
          </div>
          <div className="paso">
            <div className="nro">4</div>
            <div>
              <h4>Tú recibes su avance</h4>
              <p>
                Te llega un resumen claro por WhatsApp: qué practicó, qué domina
                y qué necesita reforzar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== PARA LOS PADRES ====== */}
      <section className="seccion">
        <h2 className="seccion-titulo">Hecho para darte tranquilidad</h2>
        <p className="seccion-intro">
          No es solo una app para el niño: es tu ventana a su aprendizaje, sin
          tener que sentarte cada tarde con él.
        </p>
        <div className="rejilla">
          <div className="beneficio">
            <span className="emoji">🧠</span>
            <h4>Aprende de verdad</h4>
            <p>
              Método socrático: razona y entiende el porqué, no memoriza el
              resultado.
            </p>
          </div>
          <div className="beneficio">
            <span className="emoji">📊</span>
            <h4>Reportes para ti</h4>
            <p>
              Ves su progreso por tema y recibes resúmenes por WhatsApp cada
              semana.
            </p>
          </div>
          <div className="beneficio">
            <span className="emoji">🛡️</span>
            <h4>Entorno seguro</h4>
            <p>
              Solo matemáticas de primaria. Sin chats con extraños, sin
              anuncios.
            </p>
          </div>
          <div className="beneficio">
            <span className="emoji">🎯</span>
            <h4>Adaptado a su curso</h4>
            <p>Contenido alineado al currículo de 3°, 4° y 5° de primaria.</p>
          </div>
          <div className="beneficio">
            <span className="emoji">💪</span>
            <h4>Gana confianza</h4>
            <p>
              Deja de tenerle miedo a las mates y se siente capaz de hacerlo
              solo.
            </p>
          </div>
          <div className="beneficio">
            <span className="emoji">🕊️</span>
            <h4>Menos peleas en casa</h4>
            <p>Recupera la tarde: la tarea deja de ser un campo de batalla.</p>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIOS ====== */}
      <section className="seccion">
        <h2 className="seccion-titulo">Lo que dicen otras familias</h2>
        <p className="seccion-intro">
          Padres y madres que pasaron de pelear con la tarea a verla resuelta
          sola.
        </p>
        <div className="testimonios">
          <div className="testimonio">
            <div className="estrellas">★★★★★</div>
            <p>
              "Mi hija pasó de llorar con las divisiones a explicármelas a mí.
              Lo mejor es que entiende, no copia."
            </p>
            <div className="autor">
              <div className="avatar">M</div>
              <div>
                <b>Marta G.</b>
                <small>mamá de Lucía, 4° primaria</small>
              </div>
            </div>
          </div>
          <div className="testimonio">
            <div className="estrellas">★★★★★</div>
            <p>
              "Trabajo hasta tarde y no podía ayudarle. Ahora hace la tarea solo
              y yo recibo el resumen en el móvil. Impagable."
            </p>
            <div className="autor">
              <div className="avatar">J</div>
              <div>
                <b>Javier R.</b>
                <small>papá de Mateo, 5° primaria</small>
              </div>
            </div>
          </div>
          <div className="testimonio">
            <div className="estrellas">★★★★★</div>
            <p>
              "Subió de un 5 a un 8 en mate en un trimestre. Pero lo que más
              valoro es que ya no le tiene miedo."
            </p>
            <div className="autor">
              <div className="avatar">C</div>
              <div>
                <b>Carolina P.</b>
                <small>mamá de Tomás, 3° primaria</small>
              </div>
            </div>
          </div>
          <div className="testimonio">
            <div className="estrellas">★★★★★</div>
            <p>
              "Probé otras apps que daban la respuesta y no servían. Esta lo
              hace pensar. Esa es toda la diferencia."
            </p>
            <div className="autor">
              <div className="avatar">A</div>
              <div>
                <b>Andrés M.</b>
                <small>papá de Sofía, 4° primaria</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== PLANES ====== */}
      <section className="seccion" id="planes">
        <h2 className="seccion-titulo">Planes para tu familia</h2>
        <p className="seccion-intro">
          Ambos planes incluyen días de prueba gratis. Sin permanencia, cancela
          cuando quieras. Menos que una hora de clases particulares.
        </p>
        <div className="planes">
          <div className="plan">
            <h4>Mensual</h4>
            <div className="precio">
              $39.900<small> /mes</small>
            </div>
            <p className="desc">
              Toda la app. Empieza con días de prueba gratis, cancela cuando
              quieras.
            </p>
            <ul>
              <li>Tutor ilimitado paso a paso</li>
              <li>Reportes por WhatsApp</li>
              <li>Práctica adaptada por tema</li>
              <li>Todo el currículo 3°–5°</li>
            </ul>
            {isSignedIn ? (
              <Link href="/api/checkout?plan=mensual">
                <span className="btn fantasma">Empezar ahora →</span>
              </Link>
            ) : (
              <SignUpButton forceRedirectUrl="/configurar">
                <button className="btn fantasma">Empezar ahora</button>
              </SignUpButton>
            )}
          </div>

          <div className="plan destacado">
            <span className="etiqueta">Ahorra 58%</span>
            <h4>Anual</h4>
            <div className="precio">
              $199.999<small> /año</small>
            </div>
            <p className="desc">
              Equivale a $16.667/mes. Días de prueba gratis incluidos.
            </p>
            <ul>
              <li>Todo lo del plan Mensual</li>
              <li>Pagas como 5 meses, usas los 12</li>
              <li>Panel de avance del hijo</li>
              <li>Soporte prioritario</li>
            </ul>
            {isSignedIn ? (
              <Link href="/api/checkout?plan=anual">
                <span className="btn coral">Empezar ahora →</span>
              </Link>
            ) : (
              <SignUpButton forceRedirectUrl="/configurar">
                <button className="btn coral">Empezar ahora →</button>
              </SignUpButton>
            )}
          </div>
        </div>
        <p className="nota" style={{ marginTop: 16, textAlign: "center" }}>
          💳 Pago seguro · Cancela cuando quieras · Días de prueba gratis
          incluidos
        </p>
      </section>

      {/* ====== FAQ ====== */}
      <section className="seccion">
        <h2 className="seccion-titulo">Preguntas frecuentes</h2>
        <div className="faq">
          <details>
            <summary>¿De verdad no le da la respuesta?</summary>
            <p>
              Exacto. El tutor está diseñado para guiar con preguntas y pistas
              hasta que tu hijo llega solo al resultado. Aprende el método, no
              memoriza el número.
            </p>
          </details>
          <details>
            <summary>¿Necesita que yo esté presente?</summary>
            <p>
              No. Está pensado para que el niño lo use solo. Tú recibes un
              resumen de su avance por WhatsApp y puedes revisar el panel cuando
              quieras.
            </p>
          </details>
          <details>
            <summary>¿Para qué edades y cursos sirve?</summary>
            <p>
              Matemáticas de 3°, 4° y 5° de primaria, con contenido alineado al
              currículo de cada curso. Pronto añadiremos más cursos.
            </p>
          </details>
          <details>
            <summary>¿Es seguro para mi hijo?</summary>
            <p>
              Totalmente. Es un entorno cerrado solo de matemáticas: sin
              publicidad, sin chats con desconocidos y sin contenido externo.
            </p>
          </details>
          <details>
            <summary>¿Puedo cancelar cuando quiera?</summary>
            <p>
              Sí, sin permanencia ni penalizaciones. Además tienes 7 días de
              prueba gratis y garantía de devolución de 30 días.
            </p>
          </details>
        </div>
      </section>

      {/* ====== CTA FINAL ====== */}
      <div className="cta-final">
        <h2>
          Que la tarea deje de ser una <span className="marca">pelea</span>.
        </h2>
        <p>
          Dale a tu hijo un tutor que le enseña a pensar, y a ti la tranquilidad
          de ver su progreso. Empieza gratis hoy.
        </p>
        {isSignedIn ? (
          <Link href="/tutor">
            <span className="btn coral">Ir al tutor →</span>
          </Link>
        ) : (
          <SignUpButton forceRedirectUrl="/configurar">
            <button className="btn coral">Crear cuenta de familia →</button>
          </SignUpButton>
        )}
      </div>

      <p className="pie">
        Tutor de Tareas · Matemáticas de primaria · Hecho con cariño para las
        familias 💛
      </p>
    </main>
  );
}
