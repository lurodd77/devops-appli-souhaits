"use client";
 
import { useState, useMemo, useEffect } from "react";
import styles from "./wish.module.css";
 
export default function WishPage() {
  const today = new Date();
 
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [wishName, setWishName] = useState("");
  const [wishDate, setWishDate] = useState("");
  const initialWishes = [
    {
      id: 1,
      name: 'Me faire Tatouer',
      // date au format YYYY-MM-DD (aujourd'hui) pour être visible dans le mois courant
      date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
        today.getDate()
      ).padStart(2, '0')}`,
      done: true,
    },
  ];

  // keep initial state deterministic (same on server and client)
  const [wishes, setWishes] = useState(initialWishes);

  // utilisateur connecté en dur (pour démo)
  const [connectedUser, setConnectedUser] = useState('user1');

  // charger les données depuis localStorage uniquement côté client
  useEffect(() => {
    try {
      const raw = localStorage.getItem('wishes');
      if (raw) setWishes(JSON.parse(raw));
      const cu = localStorage.getItem('connectedUser');
      if (cu) setConnectedUser(cu);
    } catch (e) {
      // ignore
    }
  }, []);

  // sauvegarder les changements côté client
  useEffect(() => {
    try { localStorage.setItem('wishes', JSON.stringify(wishes)); } catch (e) {}
  }, [wishes]);

  useEffect(() => {
    try { localStorage.setItem('connectedUser', connectedUser); } catch (e) {}
  }, [connectedUser]);
 
  const daysInMonth = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0).getDate(),
    [currentMonth, currentYear]
  );
 
  const firstDayOfMonth = useMemo(
    () => new Date(currentYear, currentMonth, 1),
    [currentMonth, currentYear]
  );
 
  const startingWeekday = (firstDayOfMonth.getDay() + 6) % 7;
 
  const monthLabel = new Date(currentYear, currentMonth).toLocaleString("fr-FR", {
    month: "long",
    year: "numeric",
  });
 
  const isSameDay = (dateStr, year, month, day) => {
    if (!dateStr) return false;
    const d = new Date(dateStr + "T00:00:00");
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day
    );
  };
 
  const hasWishesOnDay = (day) => {
    return wishes.some((w) => isSameDay(w.date, currentYear, currentMonth, day));
  };
 
  const isToday = (day) => {
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === day
    );
  };
 
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };
 
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };
 
  const handleAddWish = (e) => {
    e.preventDefault();
    if (!wishName.trim()) return;
 
    const newWish = {
      id: Date.now(),
      name: wishName.trim(),
      date: wishDate || null,
      done: false,
    };
 
    setWishes((prev) => [...prev, newWish]);
    setWishName("");
    setWishDate("");
  };

  const toggleDone = (id) => {
    setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, done: !w.done } : w)));
  };

  const deleteWish = (id) => {
    setWishes((prev) => prev.filter((w) => w.id !== id));
  };
 
  const wishesThisMonth = wishes.filter((w) => {
    if (!w.date) return false;
    const d = new Date(w.date + "T00:00:00");
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });
 
  const wishesWithoutDate = wishes.filter((w) => !w.date);
 
  // utiliser les noms complets des jours pour une meilleure lisibilité
  const dayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  // état pour afficher/cacher l'introduction longue
  const [showIntro, setShowIntro] = useState(false);
 
  const calendarCells = [];
 
  for (let i = 0; i < startingWeekday; i++) {
    calendarCells.push(<div key={`empty-${i}`} className={styles.dayCellEmpty} />);
  }
 
  for (let day = 1; day <= daysInMonth; day++) {
    const isTodayFlag = isToday(day);
    const dayWishes = wishes.filter((w) => isSameDay(w.date, currentYear, currentMonth, day));
    const hasWishes = dayWishes.length > 0;
    const anyDone = dayWishes.some((w) => w.done);

    calendarCells.push(
      <div
        key={day}
        className={`${styles.dayCell} ${isTodayFlag ? styles.dayToday : ""} ${
          hasWishes ? styles.dayWithWish : ""
        }`}
      >
        <span>{day}</span>
        {hasWishes && (anyDone ? <span className={styles.dotDone} /> : <span className={styles.dot} />)}
      </div>
    );
  }
 
  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.appTitle}>
          <span className="app-title">Vœux • MonAppli</span>
        </div>
        <div className={styles.userBadge}>
          <div className={styles.avatar}>{connectedUser.charAt(0).toUpperCase()}</div>
          <div>Connecté en tant que <strong style={{color:'var(--primary)'}}>{connectedUser}</strong></div>
        </div>
      </div>

      <h1 className={styles.title}>Mes vœux du mois</h1>

      <div className={styles.containerIntro}>
        <div className={styles.introCard}>
          <p>
            Chaque nouvelle année, beaucoup de personnes prennent de bonnes résolutions : apprendre
            quelque chose de nouveau, lire davantage, voyager ou encore prendre soin de leur santé.
            Pourtant, ces engagements ne durent généralement pas plus d’un mois… moi le premier,
            j’ai fini par arrêter d’en prendre.
          </p>
          {showIntro && (
            <>
              <p>
                Et si la différence venait simplement d’un manque de motivation régulière ? Lorsqu’une
                personne est stimulée au quotidien, elle est capable d’atteindre n’importe quel objectif.
              </p>
              <p>
                Imaginez alors une application mobile, connectée à une montre intelligente, capable de
                nous rappeler continuellement nos objectifs. Une application qui nous aide à progresser
                grâce à des paliers intermédiaires, qui nous encourage et nous félicite à chaque étape
                franchie. Peut-être que grâce à un tel outil, nos bonnes résolutions tiendraient enfin sur la durée.
              </p>
              <p><strong>Exemples d’objectifs / Challenges :</strong></p>
              <ul>
                <li>Mettre en place un système d’encouragement, de compétitions et de classement, avec plusieurs niveaux.</li>
                <li>Réaliser un certain nombre de pas dans un délai défini, en fonction d’un objectif préalablement fixé.</li>
                <li>Parrainer des personnes de son entourage pour les inciter à participer ou progresser dans le challenge.</li>
              </ul>
              <p><strong>Fixez vos objectifs pour ce mois</strong></p>
              <p>
                Le suivi de vos objectifs mensuels est essentiel pour progresser régulièrement. Voici
                quelques rappels importants en fonction du moment du mois :
              </p>
              <p><em>Avant le 15 du mois</em> — Il vous reste encore du temps pour avancer : assurez-vous d’être en bonne voie pour atteindre vos objectifs.</p>
              <p><em>Après le 15 du mois</em> — Nous avons dépassé la moitié du mois. Il devient urgent de finaliser vos objectifs en cours.</p>
            </>
          )}
          <button className={styles.toggleIntro} onClick={() => setShowIntro((s) => !s)}>
            {showIntro ? 'Lire moins' : 'Lire la suite'}
          </button>
        </div>
      </div>
 
      <div className={styles.layout}>
        {/* CALENDRIER */}
<section className={styles.calendarSection}>
<header className={styles.calendarHeader}>
<button onClick={handlePrevMonth} className={styles.navButton}>◀</button>
<h2 className={styles.monthLabel}>{monthLabel}</h2>
<button onClick={handleNextMonth} className={styles.navButton}>▶</button>
</header>
 
          <div className={styles.dayNamesRow}>
            {dayNames.map((name) => (
<div key={name} className={styles.dayName}>{name}</div>
            ))}
</div>
 
          <div className={styles.calendarGrid}>{calendarCells}</div>
 
          <div className={styles.legend}>
<div className={styles.legendItem}>
<span className={`${styles.legendDot}`} style={{ background: "#0070f3" }} />
<span>Aujourd'hui</span>
</div>
<div className={styles.legendItem}>
<span className={`${styles.legendDot}`} style={{ background: "#ff9800" }} />
<span>Jour avec vœu</span>
</div>
</div>
</section>
 
        {/* FORMULAIRE + LISTE */}
<section className={styles.rightColumn}>
<div className={styles.card}>
<h2 className={styles.sectionTitle}>Créer un vœu</h2>
<form onSubmit={handleAddWish} className={styles.form}>
<div className={styles.field}>
<label className={styles.label}>Nom du vœu</label>
<input
                  type="text"
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  placeholder="Ex : Voyage, nouveau PC..."
                  className={styles.input}
                />
</div>
 
              <div className={styles.field}>
<label className={styles.label}>Date</label>
<input
                  type="date"
                  value={wishDate}
                  onChange={(e) => setWishDate(e.target.value)}
                  className={styles.input}
                />
<small className={styles.helper}>
                  Si tu choisis une date, elle sera affichée sur le calendrier.
</small>
</div>
 
              <button type="submit" className={styles.submitButton}>
                Ajouter le vœu
</button>
</form>
</div>
 
          <div className={styles.card}>
<h2 className={styles.sectionTitle}>Vœux du mois affiché</h2>
 
            {wishesThisMonth.length === 0 && wishesWithoutDate.length === 0 && (
<p className={styles.emptyText}>Aucun vœu pour l'instant.</p>
            )}
 
            {wishesThisMonth.length > 0 && (
<>
<h3 className={styles.subTitle}>Avec date dans ce mois</h3>
<ul className={styles.list}>
                  {wishesThisMonth.map((w) => (
                    <li key={w.id} className={`${styles.listItem} ${w.done ? styles.listItemDone : ''}`}>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <button className={styles.iconButton} onClick={() => toggleDone(w.id)} aria-label="Marquer comme fait">
                          {w.done ? '✓' : '○'}
                        </button>
                        <span>{w.name}</span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <span className={styles.dateBadge}>
                          {new Date(w.date + "T00:00:00").toLocaleDateString("fr-FR")}
                        </span>
                        <button className={styles.trashButton} onClick={() => deleteWish(w.id)} aria-label="Supprimer">🗑</button>
                      </div>
                    </li>
                  ))}
</ul>
</>
            )}
 
            {wishesWithoutDate.length > 0 && (
<>
<h3 className={styles.subTitle}>Sans date précise</h3>
<ul className={styles.list}>
                  {wishesWithoutDate.map((w) => (
                    <li key={w.id} className={`${styles.listItem} ${w.done ? styles.listItemDone : ''}`}>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <button className={styles.iconButton} onClick={() => toggleDone(w.id)} aria-label="Marquer comme fait">
                          {w.done ? '✓' : '○'}
                        </button>
                        <span>{w.name}</span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <span className={styles.dateBadgeMuted}>Sans date</span>
                        <button className={styles.trashButton} onClick={() => deleteWish(w.id)} aria-label="Supprimer">🗑</button>
                      </div>
                    </li>
                  ))}
</ul>
</>
            )}
</div>
</section>
</div>
</div>
  );
}