import React from 'react';
import styles from './QuickAddEvent.module.css';

const QuickAddEvent = () => {
  const handleQuickAdd = () => {
    // URL para agregar evento rápido al calendario específico
    const quickAddUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Recordatorio%20DevOps&dates=20250629T180000Z/20250629T200000Z&details=Evento%20del%20programa%2090%20D%C3%ADas%20de%20DevOps&ctz=America/Argentina/Buenos_Aires`;
    
    window.open(quickAddUrl, '_blank');
  };

  const handleOpenCalendar = () => {
    // URL directa al calendario público
    const calendarUrl = 'https://calendar.google.com/calendar/embed?src=69e0096b8ebf5cfa5db7f7f4c934fc0ea8e33cf715468e1cabb857fbe012c798%40group.calendar.google.com&ctz=America%2FArgentina%2FBuenos_Aires';
    window.open(calendarUrl, '_blank');
  };

  const handleSubscribe = () => {
    // URL para suscribirse al calendario
    const subscribeUrl = 'https://calendar.google.com/calendar/u/0?cid=69e0096b8ebf5cfa5db7f7f4c934fc0ea8e33cf715468e1cabb857fbe012c798@group.calendar.google.com';
    window.open(subscribeUrl, '_blank');
  };

  return (
    <div className={styles.quickAddEvent}>
      <div className={styles.header}>
        <h3>🚀 Acceso Rápido al Calendario</h3>
        <p>Gestiona tus eventos DevOps directamente</p>
      </div>
      
      <div className={styles.actionsGrid}>
        <button onClick={handleOpenCalendar} className={`${styles.actionBtn} ${styles.primary}`}>
          <span className={styles.actionIcon}>🗓️</span>
          <div className={styles.actionContent}>
            <strong>Ver Calendario</strong>
            <span>Abrir en Google Calendar</span>
          </div>
        </button>

        <button onClick={handleSubscribe} className={`${styles.actionBtn} ${styles.success}`}>
          <span className={styles.actionIcon}>➕</span>
          <div className={styles.actionContent}>
            <strong>Suscribirse</strong>
            <span>Agregar a mi calendario</span>
          </div>
        </button>

        <button onClick={handleQuickAdd} className={`${styles.actionBtn} ${styles.info}`}>
          <span className={styles.actionIcon}>⚡</span>
          <div className={styles.actionContent}>
            <strong>Evento Rápido</strong>
            <span>Crear recordatorio</span>
          </div>
        </button>
      </div>

      <div className={styles.calendarInfo}>
        <h4>📋 Información del Calendario</h4>
        <div className={styles.infoItems}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>🌍 Zona Horaria:</span>
            <span>Argentina (GMT-3)</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>🔔 Notificaciones:</span>
            <span>15 minutos antes</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>📱 Plataformas:</span>
            <span>Twitch Live + YouTube</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>🎯 Tipo:</span>
            <span>Eventos gratuitos para surfear la ola DevOps</span>
          </div>
        </div>
      </div>

      <div className={styles.socialLinks}>
        <h4>🔗 Enlaces Relacionados</h4>
        <div className={styles.socialGrid}>
          <a href="https://www.youtube.com/@295devops" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            📺 Canal YouTube
          </a>
          <a href="https://twitch.tv/roxsross" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            📺 Canal Twitch
          </a>
          <a href="https://discord.com/invite/RWQjCRaVJ3" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            💬 Discord
          </a>
          <a href="https://twitter.com/roxsross" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            🐦 Twitter
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuickAddEvent;
