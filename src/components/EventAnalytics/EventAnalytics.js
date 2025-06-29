import React, { useState, useEffect } from 'react';
import styles from './EventAnalytics.module.css';

const EventAnalytics = ({ events = [] }) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    workshopsCount: 0,
    qaSessionsCount: 0,
    demosCount: 0,
    registeredUsers: 0,
    mostPopularTime: '',
    averageAttendance: 0,
    nextWeekEvents: 0
  });

  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    if (events && events.length > 0) {
      calculateStats();
    }
  }, [events]);

  const calculateStats = () => {
    if (!events || events.length === 0) {
      return;
    }
    
    const now = new Date();
    const nextWeek = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    const upcoming = events.filter(event => new Date(event.date) > now);
    const workshops = events.filter(event => event.type === 'workshop');
    const qaSessions = events.filter(event => event.type === 'qa');
    const demos = events.filter(event => event.type === 'demo');
    const nextWeekEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > now && eventDate <= nextWeek;
    });

    // Calcular horario más popular
    const timeFrequency = {};
    events.forEach(event => {
      if (event.time) {
        const hour = event.time.split(':')[0];
        timeFrequency[hour] = (timeFrequency[hour] || 0) + 1;
      }
    });
    
    const mostPopularHour = Object.keys(timeFrequency).reduce((a, b) => 
      timeFrequency[a] > timeFrequency[b] ? a : b, '18'
    );

    setStats({
      totalEvents: events.length,
      upcomingEvents: upcoming.length,
      workshopsCount: workshops.length,
      qaSessionsCount: qaSessions.length,
      demosCount: demos.length,
      registeredUsers: Math.floor(Math.random() * 500) + 150, // Simulado
      mostPopularTime: `${mostPopularHour}:00`,
      averageAttendance: Math.floor(Math.random() * 50) + 30, // Simulado
      nextWeekEvents: nextWeekEvents.length
    });
  };

  const MetricCard = ({ title, value, icon, color, description }) => (
    <div className={`${styles.metricCard} ${styles[color]}`}>
      <div className={styles.metricIcon}>{icon}</div>
      <div className={styles.metricContent}>
        <h3>{value}</h3>
        <p>{title}</p>
        {description && <span className={styles.metricDescription}>{description}</span>}
      </div>
    </div>
  );

  const getEventTypeDistribution = () => {
    const total = events?.length || 0;
    if (total === 0) return [];
    
    return [
      { 
        type: 'Workshops', 
        count: stats.workshopsCount, 
        percentage: Math.round((stats.workshopsCount / total) * 100),
        color: '#4CAF50'
      },
      { 
        type: 'Q&A Sessions', 
        count: stats.qaSessionsCount, 
        percentage: Math.round((stats.qaSessionsCount / total) * 100),
        color: '#2196F3'
      },
      { 
        type: 'Demos', 
        count: stats.demosCount, 
        percentage: Math.round((stats.demosCount / total) * 100),
        color: '#FF9800'
      }
    ];
  };

  const getUpcomingEventsTimeline = () => {
    if (!events || events.length === 0) return [];
    
    const now = new Date();
    return events
      .filter(event => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)
      .map(event => ({
        ...event,
        daysUntil: Math.ceil((new Date(event.date) - now) / (1000 * 60 * 60 * 24))
      }));
  };

  return (
    <div className={styles.eventAnalytics}>
      <div className={styles.analyticsHeader}>
        <h2>📊 Analytics del Calendario</h2>
        <p>Estadísticas y métricas de los eventos DevOps</p>
      </div>

      {/* Métricas Principales */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Total de Eventos"
          value={stats.totalEvents}
          icon="🗓️"
          color="primary"
          description="Eventos programados"
        />
        <MetricCard
          title="Próximos Eventos"
          value={stats.upcomingEvents}
          icon="⏰"
          color="info"
          description="Por realizarse"
        />
        <MetricCard
          title="Usuarios Registrados"
          value={stats.registeredUsers}
          icon="👥"
          color="success"
          description="Total acumulado"
        />
        <MetricCard
          title="Promedio Asistencia"
          value={`${stats.averageAttendance}%`}
          icon="📈"
          color="warning"
          description="Asistencia promedio"
        />
      </div>

      {/* Navegación de Secciones */}
      <div className={styles.analyticsNav}>
        <button 
          className={`${styles.navBtn} ${selectedMetric === 'overview' ? styles.active : ''}`}
          onClick={() => setSelectedMetric('overview')}
        >
          📊 Resumen
        </button>
        <button 
          className={`${styles.navBtn} ${selectedMetric === 'distribution' ? styles.active : ''}`}
          onClick={() => setSelectedMetric('distribution')}
        >
          🎯 Distribución
        </button>
        <button 
          className={`${styles.navBtn} ${selectedMetric === 'timeline' ? styles.active : ''}`}
          onClick={() => setSelectedMetric('timeline')}
        >
          ⏳ Timeline
        </button>
      </div>

      {/* Contenido Dinámico */}
      <div className={styles.analyticsContent}>
        {selectedMetric === 'overview' && (
          <div className={styles.overviewSection}>
            <div className={styles.insightCards}>
              <div className={styles.insightCard}>
                <h4>🎯 Horario Más Popular</h4>
                <p className={styles.insightValue}>{stats.mostPopularTime} GMT-3</p>
                <span>La mayoría de eventos se programan a esta hora</span>
              </div>
              
              <div className={styles.insightCard}>
                <h4>📅 Esta Semana</h4>
                <p className={styles.insightValue}>{stats.nextWeekEvents} eventos</p>
                <span>Eventos programados para los próximos 7 días</span>
              </div>
              
              <div className={styles.insightCard}>
                <h4>🏆 Tipo Más Popular</h4>
                <p className={styles.insightValue}>
                  {stats.workshopsCount >= stats.qaSessionsCount && stats.workshopsCount >= stats.demosCount ? 'Workshops' :
                   stats.qaSessionsCount >= stats.demosCount ? 'Q&A Sessions' : 'Demos'}
                </p>
                <span>Tipo de evento más frecuente</span>
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'distribution' && (
          <div className={styles.distributionSection}>
            <h3>Distribución por Tipo de Evento</h3>
            <div className={styles.distributionChart}>
              {getEventTypeDistribution().map((item, index) => (
                <div key={index} className={styles.distributionItem}>
                  <div className={styles.distributionBar}>
                    <div 
                      className={styles.distributionFill}
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color 
                      }}
                    ></div>
                  </div>
                  <div className={styles.distributionInfo}>
                    <span className={styles.distributionType}>{item.type}</span>
                    <span className={styles.distributionStats}>
                      {item.count} eventos ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMetric === 'timeline' && (
          <div className={styles.timelineSection}>
            <h3>Próximos Eventos</h3>
            <div className={styles.timelineList}>
              {getUpcomingEventsTimeline().map((event, index) => (
                <div key={event.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} style={{
                    backgroundColor: 
                      event.type === 'workshop' ? '#4CAF50' :
                      event.type === 'qa' ? '#2196F3' : '#FF9800'
                  }}></div>
                  <div className={styles.timelineContent}>
                    <h4>{event.title}</h4>
                    <p className={styles.timelineDate}>
                      📅 {new Date(event.date).toLocaleDateString('es-AR')} - 
                      ⏰ {event.time} GMT-3
                    </p>
                    <p className={styles.timelineDays}>
                      {event.daysUntil === 0 ? 'Hoy' : 
                       event.daysUntil === 1 ? 'Mañana' : 
                       `En ${event.daysUntil} días`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Consejos y Recomendaciones */}
      <div className={styles.recommendationsSection}>
        <h3>💡 Recomendaciones</h3>
        <div className={styles.recommendations}>
          <div className={styles.recommendation}>
            <span className={styles.recommendationIcon}>🎯</span>
            <div>
              <strong>Horario Óptimo</strong>
              <p>Los eventos entre 18:00-19:00 GMT-3 tienen mayor asistencia</p>
            </div>
          </div>
          <div className={styles.recommendation}>
            <span className={styles.recommendationIcon}>📅</span>
            <div>
              <strong>Frecuencia</strong>
              <p>Mantener 2-3 eventos por semana maximiza el engagement</p>
            </div>
          </div>
          <div className={styles.recommendation}>
            <span className={styles.recommendationIcon}>🎨</span>
            <div>
              <strong>Variedad</strong>
              <p>Combinar workshops prácticos con sesiones Q&A teóricas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
