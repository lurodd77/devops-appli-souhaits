"use client";
 
import { useRouter } from "next/navigation";
import { useState } from "react";
 
export default function LoginPage() {
  const router = useRouter();
  const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
 
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifiant, password }),
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        setError(data?.message || 'Erreur lors de la connexion');
        setLoading(false);
        return;
      }
 
      // succès
      router.push('/wish');
    } catch (err) {
      setError('Erreur réseau');
      setLoading(false);
    }
  };
 
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Connexion</h1>
 
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Identifiant"
          value={identifiant}
          onChange={(e) => setIdentifiant(e.target.value)}
          style={styles.input}
        />
 
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
 
        <button type="submit" style={styles.button}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
      </form>
    </div>
  );
}
 
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f5f5f5",
  },
  title: {
    fontSize: "2rem",
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: 300,
    gap: 15,
  },
  input: {
    padding: "10px 15px",
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    borderRadius: 8,
    background: "#0070f3",
    color: "white",
    cursor: "pointer",
    border: "none",
    fontWeight: "bold",
  },
};