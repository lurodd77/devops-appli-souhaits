import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifiant, password } = body;

    // Vérification simple
    if (!identifiant || !password) {
      return NextResponse.json(
        { error: "Identifiant et mot de passe requis." },
        { status: 400 }
      );
    }

    // FAUX utilisateur (exemple)
    if (identifiant === "user1" && password === "pass1") {
      return NextResponse.json({
        message: "Connexion réussie",
        token: "demo-token-123",
      });
    }

    return NextResponse.json(
      { error: "Identifiants incorrects." },
      { status: 401 }
    );
  } catch (e) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}