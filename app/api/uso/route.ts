import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

// GET /api/uso — retorna cuántas preguntas gratuitas ha usado el usuario
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("progreso_temas")
    .select("preguntas_totales")
    .eq("user_id", userId);

  const total = data?.reduce((sum, r) => sum + (r.preguntas_totales ?? 0), 0) ?? 0;
  return NextResponse.json({ uso: total });
}
