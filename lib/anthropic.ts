// Llamada al modelo desde el servidor (nunca expongas la clave en el cliente).
// Prioridad: Gemini → Groq → Anthropic

type BloqueTexto = { type: "text"; text: string }
type BloqueImagen = { type: "image"; source: { type: "base64"; media_type: string; data: string } }
type Bloque = BloqueTexto | BloqueImagen

export interface Mensaje {
  role: "user" | "assistant";
  content: string | Bloque[];
}

// Llamada rápida sin system prompt — solo para extracción/OCR de imagen
export async function llamarRapido(messages: Mensaje[], maxTokens = 300): Promise<string> {
  return llamarModelo("Eres un asistente que extrae texto de imágenes. Responde solo con el texto extraído.", messages, maxTokens)
}

// Errores que vale la pena reintentar (servidor caído, timeout, rate limit)
function esReintentable(err: unknown): boolean {
  const msg = String(err)
  return msg.includes("503") || msg.includes("529") || msg.includes("overloaded") ||
    msg.includes("unavailable") || msg.includes("rate") || msg.includes("timeout")
}

async function conReintentos<T>(fn: () => Promise<T>, intentos = 2, delayMs = 800): Promise<T> {
  for (let i = 0; i <= intentos; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i === intentos || !esReintentable(err)) throw err
      await new Promise(r => setTimeout(r, delayMs * (i + 1)))
    }
  }
  throw new Error("Sin respuesta tras reintentos")
}

export async function llamarModelo(
  system: string,
  messages: Mensaje[],
  maxTokens = 600
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY
  const groqKey = process.env.GROQ_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  // Intenta el proveedor principal con reintentos; si falla por 503/timeout, pasa al siguiente
  if (geminiKey) {
    try {
      return await conReintentos(() => llamarGemini(geminiKey, system, messages, maxTokens))
    } catch (err) {
      if (esReintentable(err) && (groqKey || anthropicKey)) {
        console.warn("[IA] Gemini no disponible, usando fallback:", String(err).slice(0, 80))
      } else {
        throw err
      }
    }
  }
  if (groqKey) {
    try {
      return await conReintentos(() => llamarGroq(groqKey, system, messages, maxTokens))
    } catch (err) {
      if (esReintentable(err) && anthropicKey) {
        console.warn("[IA] Groq no disponible, usando fallback:", String(err).slice(0, 80))
      } else {
        throw err
      }
    }
  }
  if (anthropicKey) {
    return await conReintentos(() => llamarAnthropic(anthropicKey, system, messages, maxTokens))
  }
  throw new Error("Configura GEMINI_API_KEY, GROQ_API_KEY o ANTHROPIC_API_KEY en .env.local")
}

// ── Gemini (SDK oficial — soporta keys AIzaSy y AQ.) ──────
async function llamarGemini(apiKey: string, system: string, messages: Mensaje[], maxTokens: number) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai")
  const modelo = process.env.MODELO || "gemini-2.5-flash"

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: modelo,
    systemInstruction: system,
  })

  // Convertir mensajes al formato del SDK
  const historia = messages.map((m) => {
    const role = m.role === "assistant" ? "model" : "user"
    if (typeof m.content === "string") {
      return { role, parts: [{ text: m.content }] }
    }
    const parts = m.content.map((b) =>
      b.type === "text"
        ? { text: b.text }
        : { inlineData: { mimeType: b.source.media_type, data: b.source.data } }
    )
    return { role, parts }
  })

  // El último mensaje es el del usuario; el resto es historial
  const ultimo = historia.pop()
  if (!ultimo) throw new Error("Sin mensajes")

  // Gemini exige que el historial empiece con 'user' — descarta mensajes model del inicio
  const primerUser = historia.findIndex((m) => m.role === "user")
  const historialValido = primerUser >= 0 ? historia.slice(primerUser) : []

  const chat = model.startChat({
    history: historialValido,
    generationConfig: { maxOutputTokens: maxTokens },
  })

  const result = await chat.sendMessage(ultimo.parts)
  return result.response.text().trim()
}

// ── Groq (compatible OpenAI) ───────────────────────────────
function convertirOpenAI(messages: Mensaje[]) {
  return messages.map((m) => {
    if (typeof m.content === "string") return { role: m.role, content: m.content }
    const parts = m.content.map((b) =>
      b.type === "text"
        ? { type: "text", text: b.text }
        : { type: "image_url", image_url: { url: `data:${b.source.media_type};base64,${b.source.data}` } }
    )
    return { role: m.role, content: parts }
  })
}

async function llamarGroq(apiKey: string, system: string, messages: Mensaje[], maxTokens: number) {
  const modelo = process.env.MODELO || "llama-3.3-70b-versatile"
  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: modelo,
      max_tokens: maxTokens,
      messages: [{ role: "system", content: system }, ...convertirOpenAI(messages)],
    }),
  })
  if (!resp.ok) throw new Error(`Error Groq (${resp.status}): ${await resp.text()}`)
  const data = await resp.json()
  return data.choices?.[0]?.message?.content?.trim() ?? ""
}

// ── Anthropic ─────────────────────────────────────────────
async function llamarAnthropic(apiKey: string, system: string, messages: Mensaje[], maxTokens: number) {
  const modelo = process.env.MODELO || "claude-haiku-4-5-20251001"
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: modelo, max_tokens: maxTokens, system, messages }),
  })
  if (!resp.ok) throw new Error(`Error Anthropic (${resp.status}): ${await resp.text()}`)
  const data = await resp.json()
  return (data.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("\n").trim()
}
