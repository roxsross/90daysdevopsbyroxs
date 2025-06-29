import React, { useState, useEffect } from 'react';
import styles from './NotificationSystem.module.css';

const NotificationSystem = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Verificar si las notificaciones están soportadas
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setSubscribed(true);
        // Mostrar notificación de confirmación
        new Notification('🎉 ¡Notificaciones Activadas!', {
          body: 'Te avisaremos 15 minutos antes de cada evento DevOps',
          icon: '/img/295.png',
          badge: '/img/295.png'
        });
      }
    }
  };

  const scheduleEventNotifications = (events) => {
    events.forEach(event => {
      const eventTime = new Date(`${event.date}T${event.time}:00-03:00`);
      const notificationTime = new Date(eventTime.getTime() - (15 * 60 * 1000)); // 15 min antes
      const now = new Date();

      if (notificationTime > now) {
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(`🚨 Evento en 15 minutos: ${event.title}`, {
              body: `${event.time} - ${event.description}`,
              icon: '/img/295.png',
              badge: '/img/295.png',
              actions: [
                { action: 'join', title: '🔗 Unirme Ahora' },
                { action: 'remind', title: '⏰ Recordar en 5 min' }
              ]
            });
          }
        }, timeUntilNotification);
      }
    });
  };

  return (
    <div className={styles.notificationSystem}>
      {permission === 'default' && (
        <div className={styles.notificationPrompt}>
          <div className={styles.promptContent}>
            <h4>🔔 Recibe Recordatorios de Eventos</h4>
            <p>Te enviaremos una notificación 15 minutos antes de cada workshop o sesión</p>
            <button 
              onClick={requestNotificationPermission}
              className={styles.enableBtn}
            >
              🚀 Activar Notificaciones
            </button>
          </div>
        </div>
      )}

      {permission === 'granted' && subscribed && (
        <div className={styles.notificationActive}>
          <span className={styles.activeIcon}>✅</span>
          <strong>Notificaciones Activadas</strong>
          <p>Te avisaremos antes de cada evento</p>
        </div>
      )}

      {permission === 'denied' && (
        <div className={styles.notificationDenied}>
          <span className={styles.deniedIcon}>🚫</span>
          <p>Para recibir recordatorios, habilita las notificaciones en tu navegador</p>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
