import React from 'react';
import styles from './CalendarWidget.module.css';

const CalendarWidget = () => {
  // Próximo evento (esto podría venir de una API)
  const nextEvent = {
    title: "Workshop: Docker Fundamentals",
    date: "2025-07-05",
    time: "18:00",
    type: "workshop"
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilEvent = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilEvent(nextEvent.date);

  return (
    <div className={styles.calendarWidget}>
      <div className={styles.header}>
        <h3>🗓️ Próximo Evento</h3>
      </div>
      
      <div className={styles.eventInfo}>
        <div className={styles.eventDate}>
          <div className={styles.day}>
            {new Date(nextEvent.date).getDate()}
          </div>
          <div className={styles.monthYear}>
            {formatDate(nextEvent.date)}
          </div>
        </div>
        
        <div className={styles.eventDetails}>
          <h4>{nextEvent.title}</h4>
          <p className={styles.eventTime}>
            ⏰ {nextEvent.time} GMT-3
          </p>
          <p className={styles.countdown}>
            {daysUntil > 0 ? `En ${daysUntil} día${daysUntil > 1 ? 's' : ''}` : 'Hoy'}
          </p>
        </div>
      </div>
      
      <div className={styles.actions}>
        <a href="/calendario-interactivo" className={styles.viewAllBtn}>
          Ver todos los eventos
        </a>
      </div>
    </div>
  );
};

export default CalendarWidget;
