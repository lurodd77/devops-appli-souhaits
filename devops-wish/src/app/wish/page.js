"use client";

import { useState, useMemo } from "react";

export default function WishPage() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [wishName, setWishName] = useState("");
  const [wishDate, setWishDate] = useState(""); // format "YYYY-MM-DD"
  const [wishes, setWishes] = useState([]); // { id, name, date? }

  // Helpers
  const daysInMonth = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0).getDate(),
    [currentMonth, currentYear]
  );

  const firstDayOfMonth = useMemo(
    () => new Date(currentYear, currentMonth, 1),
    [currentMonth, currentYear]
  );

  // getDay() => 0 dimanche, 1 lundi, ...
  // On veut un calendrier commençant le lundi, donc on convertit :
  const startingWeekday = (firstDayOfMonth.getDay() + 6) % 7; // 0 = Lundi, ..., 6 = Dimanche

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

  // Construction des cases du calendrier
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const calendarCells = [];
  // cases vides avant le 1er
  for (let i = 0; i < startingWeekday; i++) {
    calendarCells.push(<div key={`empty-${i}`} style={styles.dayCellEmpty} />);
  }
  // jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    const isTodayFlag = isToday(day);
    const hasWishes = hasWishesOnDay(day);

    calendarCells.push(
      <div
        key={day}
        style={{
          ...styles.dayCell,
          ...(isTodayFlag ? styles.dayToday : {}),
          ...(hasWishes ? styles.dayWithWish : {}),
        }}
      >
        <span>{day}</span>
        {hasWishes && <span style={styles.dot} />}
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Mes vœux du mois</h1>

      <div style={styles.layout}>
        {/* Calendrier */}
        <section style={styles.calendarSection}>
          <header style={styles.calendarHeader}>
            <button onClick={handlePrevMonth} style={styles.navButton}>
              ◀
            </button>
            <h2 style={styles.monthLabel}>{monthLabel}</h2>
            <button onClick={handleNextMonth} style={styles.navButton}>
              ▶
            </button>
          </header>

          <div style={styles.dayNamesRow}>
            {dayNames.map((name) => (
              <div key={name} style={styles.dayName}>
                {name}
              </div>
            ))}
          </div>

          <div style={styles.calendarGrid}>{calendarCells}</div>

          <div style={styles.legend}>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: "#0070f3" }} />
              <span>Aujourd&apos;hui</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: "#ff9800" }} />
              <span>Jour avec vœu</span>
            </div>
          </div>
        </section>

        {/* Formulaire + liste */}
        <section style={styles.rightColumn}>
          {/* Formulaire */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Créer un vœu</h2>
            <form onSubmit={handleAddWish} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Nom du vœu</label>
                <input
                  type="text"
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  placeholder="Ex : Voyage, nouveau PC..."
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Date 
                </label>
                <input
                  type="date"
                  value={wishDate}
                  onChange={(e) => setWishDate(e.target.value)}
                  style={styles.input}
                />
                <small style={styles.helper}>
                  Si tu choisis une date, elle sera marquée sur le calendrier.
                </small>
              </div>

              <button type="submit" style={styles.submitButton}>
                Ajouter le vœu
              </button>
            </form>
          </div>

          {/* Liste des vœux */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Vœux du mois affiché</h2>

            {wishesThisMonth.length === 0 && wishesWithoutDate.length === 0 && (
              <p style={styles.emptyText}>Aucun vœu pour l&apos;instant.</p>
            )}

            {wishesThisMonth.length > 0 && (
              <>
                <h3 style={styles.subTitle}>Avec date dans ce mois</h3>
                <ul style={styles.list}>
                  {wishesThisMonth.map((w) => (
                    <li key={w.id} style={styles.listItem}>
                      <span>{w.name}</span>
                      <span style={styles.dateBadge}>
                        {new Date(w.date + "T00:00:00").toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {wishesWithoutDate.length > 0 && (
              <>
                <h3 style={styles.subTitle}>Sans date précise</h3>
                <ul style={styles.list}>
                  {wishesWithoutDate.map((w) => (
                    <li key={w.id} style={styles.listItem}>
                      <span>{w.name}</span>
                      <span style={styles.dateBadgeMuted}>Sans date</span>
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

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 24px",
    background: "#f5f5f5",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  title: {
    fontSize: "2.2rem",
    marginBottom: 24,
    textAlign: "center",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
    gap: 24,
    maxWidth: 1100,
    margin: "0 auto",
  },
  calendarSection: {
    background: "white",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  calendarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthLabel: {
    fontSize: "1.4rem",
    fontWeight: 600,
    textTransform: "capitalize",
  },
  navButton: {
    border: "none",
    background: "#eee",
    borderRadius: 999,
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  dayNamesRow: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    textAlign: "center",
    fontWeight: 600,
    marginBottom: 8,
    fontSize: 12,
    color: "#555",
  },
  dayName: {
    padding: "6px 0",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 4,
  },
  dayCellEmpty: {
    minHeight: 60,
  },
  dayCell: {
    minHeight: 60,
    borderRadius: 10,
    border: "1px solid #e0e0e0",
    padding: 6,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    fontSize: 14,
    background: "white",
  },
  dayToday: {
    borderColor: "#0070f3",
    boxShadow: "0 0 0 1px #0070f3",
  },
  dayWithWish: {
    background: "#fff3e0",
    borderColor: "#ff9800",
  },
  dot: {
    alignSelf: "flex-end",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#ff9800",
    marginTop: 4,
  },
  legend: {
    marginTop: 12,
    display: "flex",
    gap: 16,
    fontSize: 12,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  card: {
    background: "white",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    fontSize: "1.3rem",
    marginBottom: 12,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
  },
  input: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  helper: {
    fontSize: 11,
    color: "#777",
  },
  submitButton: {
    marginTop: 8,
    padding: "10px 14px",
    borderRadius: 999,
    border: "none",
    background: "#0070f3",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
  },
  subTitle: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 600,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  listItem: {
    padding: "8px 10px",
    borderRadius: 10,
    background: "#f7f7f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 14,
  },
  dateBadge: {
    padding: "4px 8px",
    borderRadius: 999,
    background: "#e3f2fd",
    fontSize: 12,
  },
  dateBadgeMuted: {
    padding: "4px 8px",
    borderRadius: 999,
    background: "#eeeeee",
    fontSize: 12,
  },
};