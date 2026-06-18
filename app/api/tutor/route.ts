import { NextRequest, NextResponse } from "next/server";
import { llamarModelo, Mensaje } from "@/lib/anthropic";
import { systemTutor } from "@/lib/prompts";
import { buscarTema } from "@/lib/curriculo";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { grado, temaId, messages, imagenBase64, imagenTipo } = await req.json();
    const tema = temaId ? buscarTema(temaId) : undefined;
    const system = systemTutor(tema, grado);

    const historia: Mensaje[] = Array.isArray(messages) ? messages.slice() : [];

    // Si viene una foto de la tarea, la adjuntamos al último mensaje del niño.
    if (imagenBase64 && historia.length > 0) {
      const ultimo = historia[historia.length - 1];
      const textoUsuario = typeof ultimo.content === "string" ? ultimo.content : "";
      historia[historia.length - 1] = {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: imagenTipo || "image/jpeg", data: imagenBase64 },
          },
          { type: "text", text: textoUsuario || "Esta es mi tarea. ¿Me ayudas a entenderla?" },
        ],
      };
    }

    const respuesta = await llamarModelo(system, historia, 600);
    return NextResponse.json({ respuesta });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
