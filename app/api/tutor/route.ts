import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { llamarModelo, llamarRapido, Mensaje } from "@/lib/anthropic";
import { systemTutor } from "@/lib/prompts";
import { buscarTema } from "@/lib/curriculo";
import { createAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: perfil } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  const esPro = perfil?.plan === "mensual" || perfil?.plan === "anual";

  if (!esPro) {
    return NextResponse.json({ error: "sin_plan" }, { status: 403 });
  }

  try {
    const { grado, temaId, messages, imagenBase64, imagenTipo } = await req.json();
    const tema = temaId ? buscarTema(temaId) : undefined;
    const system = systemTutor(tema, grado);

    const historia: Mensaje[] = Array.isArray(messages) ? messages.slice() : [];

    let ejercicioExtraido: string | null = null;

    if (imagenBase64) {
      ejercicioExtraido = await llamarRapido([
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: imagenTipo || "image/jpeg", data: imagenBase64 } },
            { type: "text", text: "Transcribe exactamente el enunciado de cada ejercicio matemático que veas en esta imagen. Solo el texto, sin resolver nada. Si hay varios ejercicios, numéralos igual que en la imagen." },
          ],
        },
      ], 300);

      if (historia.length > 0) {
        const ultimo = historia[historia.length - 1];
        const textoOriginal = typeof ultimo.content === "string" ? ultimo.content.trim() : "";
        const contexto = textoOriginal
          ? `[Foto de tarea] ${textoOriginal}\n\nEjercicio detectado:\n${ejercicioExtraido}`
          : `[Foto de tarea]\n\nEjercicio detectado:\n${ejercicioExtraido}`;

        historia[historia.length - 1] = { role: "user", content: contexto };
      }
    }

    const respuesta = await llamarModelo(system, historia, 500);
    return NextResponse.json({ respuesta, ejercicioExtraido });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/tutor]", msg);
    const esCaida = msg.includes("503") || msg.includes("unavailable") || msg.includes("overloaded");
    return NextResponse.json({
      error: esCaida
        ? "El tutor necesita un momento para descansar. Espera unos segundos y vuelve a intentarlo. 🙏"
        : "Ups, algo falló. Intenta de nuevo.",
      detalle: process.env.NODE_ENV === "development" ? msg : undefined,
    }, { status: esCaida ? 503 : 500 });
  }
}
