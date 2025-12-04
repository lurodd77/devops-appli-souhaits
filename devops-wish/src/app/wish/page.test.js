// devops-wish/src/app/wish/page.test.js

describe("Tests Unitaires Simples", () => {
  // Test 1 : Vérifie une mathématique simple
  test("L'addition fonctionne correctement", () => {
    const resultat = 2 + 2;
    expect(resultat).toBe(4);
  });

  // Test 2 : Vérifie une manipulation de chaîne de caractères
  test("La concaténation de texte fonctionne", () => {
    const hello = "Hello";
    const world = "World";
    expect(`${hello} ${world}`).toBe("Hello World");
  });
});
