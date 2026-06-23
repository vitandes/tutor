"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="contenedor" style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
      <SignUp />
    </main>
  );
}
