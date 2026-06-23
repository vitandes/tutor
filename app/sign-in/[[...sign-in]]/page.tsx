"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="contenedor" style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
      <SignIn />
    </main>
  );
}
