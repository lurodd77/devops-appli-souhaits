"use client";
 
import { useState, useMemo } from "react";
import styles from "./wish.module.css";
 
export default function WishPage() {
  const today = new Date();
 
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [wishName, setWishName] = useState("");
  const [wishDate, setWishDate] = useState("");
  const [wishes, setWishes] = useState([]);
 
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
    };
 
    setWishes((prev) => [...prev, newWish]);
    setWishName("");
    setWishDate("");
  };
 
  const wishesThisMonth = wishes.filter((w) => {
    if (!w.date) return false;
    const d = new Date(w.date + "T00:00:00");
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });
 
  const wishesWithoutDate = wishes.filter((w) => !w.date);
 
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
 
  const calendarCells = [];
 
  for (let i = 0; i < startingWeekday; i++) {
    calendarCells.push(<div key={`empty-${i}`} className={styles.dayCellEmpty} />);
  }
 
  for (let day = 1; day <= daysInMonth; day++) {
    const isTodayFlag = isToday(day);
    const hasWishes = hasWishesOnDay(day);
 
    calendarCells.push(
<div
        key={day}
        className={`${styles.dayCell} ${isTodayFlag ? styles.dayToday : ""} ${
          hasWishes ? styles.dayWithWish : ""
        }`}
>
<span>{day}</span>
        {hasWishes && <span className={styles.dot} />}
</div>
    );
  }
 
  return (
<div className={styles.page}>
<h1 className={styles.title}>Mes vœux du mois</h1>
 
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
<li key={w.id} className={styles.listItem}>
<span>{w.name}</span>
<span className={styles.dateBadge}>
                        {new Date(w.date + "T00:00:00").toLocaleDateString("fr-FR")}
</span>
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
<li key={w.id} className={styles.listItem}>
<span>{w.name}</span>
<span className={styles.dateBadgeMuted}>Sans date</span>
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