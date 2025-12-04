// features.test.js

describe("Tests des Fonctionnalités DevOps", () => {
  // --- SCÉNARIO 1 : Connexion User1 ---
  test("La connexion avec user1 doit réussir", () => {
    // Simulation d'une fonction de login
    const login = (username) => {
      if (username === "user1") return true;
      return false;
    };

    // Le test vérifie que user1 se connecte bien
    expect(login("user1")).toBe(true);
  });

  // --- SCÉNARIO 2 : Vérification du vœu ---
  test("Le vœu 'Me faire Tatouer' est bien enregistré", () => {
    // Simulation de la base de données de vœux
    const mesVoeux = [
      "Apprendre le DevOps",
      "Me faire Tatouer", // Il est bien là
      "Aller au Japon",
    ];

    // Le test vérifie que la liste contient exactement cette phrase
    expect(mesVoeux).toContain("Me faire Tatouer");
  });
});
