import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tutor de Tareas — matemáticas de primaria",
  description: "Tu hijo entiende la tarea paso a paso. Tú ves su avance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
