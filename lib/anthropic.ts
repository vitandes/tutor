// Llamada al modelo desde el servidor (nunca expongas la clave en el cliente).

type Bloque =
  | { type: "text"; text: string }
  | { type: "image"; source: { type: "base64"; media_type: string; data: string } };

export interface Mensaje {
  role: "user" | "assistant";
  content: string | Bloque[];
}

export async function llamarModelo(
  system: string,
  messages: Mensaje[],
  maxTokens = 600
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const modelo = process.env.MODELO || "claude-haiku-4-5-20251001";

  if (!apiKey) {
    throw new Error("Falta ANTHROPIC_API_KEY en .env.local");
  }

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!resp.ok) {
    const detalle = await resp.text();
    throw new Error(`Error del modelo (${resp.status}): ${detalle}`);
  }

  const data = await resp.json();
  return (data.content || [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n")
    .trim();
}
