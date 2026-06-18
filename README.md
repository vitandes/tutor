# Tutor de Tareas — MVP (matemáticas 3°–5°)

Tutor con IA que **guía paso a paso** (no da la respuesta) y le da al papá **visibilidad real** del avance de su hijo. Hecho en Next.js (App Router).

## Correr
```bash
npm install
cp .env.example .env.local   # pon tu ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

## Flujo
1. **/configurar** — el papá crea la cuenta de familia (su nombre, hijo, grado).
2. **/tutor** — el niño elige tema, sube foto o escribe, el tutor lo guía con pistas. Marca "¡Lo logré!" cuando entiende (señal de integridad y dominio) y puede pedir práctica.
3. **/padres** — panel con: ejercicios resueltos por sí mismo (lo que ChatGPT NO puede mostrar), dominio por tema (Domina / En progreso / Reforzar), resumen con IA y envío por WhatsApp.

## Diferenciadores implementados (vs. ChatGPT)
- Tutor que **no da la respuesta** (lib/prompts.ts).
- **Visibilidad para el papá**: dominio por tema + métrica de integridad.
- **Memoria por niño**: el progreso persiste por tema.
- **Seguridad**: alcance académico, cuenta del papá.
- **Encaje curricular**: alineado a DBA (lib/curriculo.ts).

## Pendiente para producción
- Login real + base de datos por hijo (hoy es localStorage).
- Pago recurrente real (Wompi/PayU con Nequi+PSE en Colombia).
- Envío automático del reporte semanal por WhatsApp.
- Completar la biblioteca curricular (los ~50 temas de 3°–5°).

Modelo por defecto: `claude-haiku-4-5` (barato). Cambia `MODELO` en `.env.local` a `claude-sonnet-4-6` para más calidad.
