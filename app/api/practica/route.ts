import { NextRequest, NextResponse } from "next/server";
import { llamarModelo } from "@/lib/anthropic";
import { systemPractica } from "@/lib/prompts";
import { buscarTema } from "@/lib/curriculo";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { grado, temaId } = await req.json();
    const tema = buscarTema(temaId);
    if (!tema) return NextResponse.json({ error: "Tema no encontrado" }, { status: 400 });

    const texto = await llamarModelo(
      systemPractica(tema, grado),
      [{ role: "user", content: "Genera los 3 ejercicios." }],
      500
    );

    const limpio = texto.replace(/```json|```/g, "").trim();
    let json: any = {};
    try {
      json = JSON.parse(limpio);
    } catch {
      json = { ejercicios: [] };
    }
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
