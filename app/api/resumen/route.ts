import { NextRequest, NextResponse } from "next/server";
import { llamarModelo } from "@/lib/anthropic";
import { systemResumen } from "@/lib/prompts";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { grado, sesiones } = await req.json();
    const detalle = (sesiones || [])
      .map(
        (s: any) =>
          `- ${s.temaNombre}: ${s.preguntas} pregunta(s), resolvió ${s.resueltosSolo || 0} por sí mismo (estado: ${s.estado || "en progreso"})`
      )
      .join("\n");

    const resumen = await llamarModelo(
      systemResumen(grado),
      [{ role: "user", content: `Temas practicados esta semana:\n${detalle || "(sin actividad)"}` }],
      300
    );
    return NextResponse.json({ resumen });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
