import React, { useState, useEffect } from 'react';
import styles from './EventCalendar.module.css';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({
    type: 'all',
    timeRange: 'all',
    searchTerm: '',
    difficulty: 'all'
  });
  const [sortBy, setSortBy] = useState('date');

  // Eventos estáticos para demostración
  // En producción, estos podrían venir de una API o CMS
  const staticEvents = [
    {
      id: 1,
      title: "🔥 [Semana 2 - Parte 2] | Docker desde cero | Contenedores I | 90 Días de DevOps con Roxs",
      date: "2025-07-06",
      time: "13:00",
      duration: "4 horas 🔥",
      type: "session",
      difficulty: "beginner",
      description: "Aprende los conceptos básicos de Docker desde cero, parte II",
      instructor: "Roxs",
      platform: "Twitch @roxsross + Youtube @295devops",
      tags: ["docker", "containers", "basics"]
    }
  ];

  useEffect(() => {
    setEvents(staticEvents);
  }, []);

  // Filtrar y ordenar eventos
  useEffect(() => {
    let filtered = [...events];

    // Filtro por tipo
    if (filters.type !== 'all') {
      filtered = filtered.filter(event => event.type === filters.type);
    }

    // Filtro por rango de tiempo
    const now = new Date();
    if (filters.timeRange === 'week') {
      const nextWeek = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= nextWeek;
      });
    } else if (filters.timeRange === 'month') {
      const nextMonth = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= nextMonth;
      });
    }

    // Filtro por dificultad
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(event => event.difficulty === filters.difficulty);
    }

    // Filtro por búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (event.tags && event.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase())))
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'popularity':
          return b.currentAttendees - a.currentAttendees;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, filters, sortBy]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'workshop':
        return '🎯';
      case 'qa':
        return '💬';
      case 'demo':
        return '🚀';
      default:
        return '📅';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'workshop':
        return '#4CAF50';
      case 'qa':
        return '#2196F3';
      case 'demo':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const isEventToday = (eventDate) => {
    const today = new Date().toISOString().split('T')[0];
    return eventDate === today;
  };

  const isEventUpcoming = (eventDate) => {
    const today = new Date().toISOString().split('T')[0];
    return eventDate > today;
  };

  const upcomingEvents = filteredEvents.filter(event => isEventUpcoming(event.date));

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '🌱 Principiante';
      case 'intermediate': return '🚀 Intermedio';
      case 'advanced': return '💡 Avanzado';
      default: return '📚 General';
    }
  };

  return (
    <div className={styles.eventCalendar}>
      <div className={styles.header}>
        <h2>📅 Próximos Encuentros</h2>
        <p>Únete a nuestras sesiones en vivo del programa 90 Días de DevOps</p>
      </div>

      {/* Controles de Filtros y Búsqueda */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Buscar eventos, tecnologías, temas..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label>📋 Tipo de Evento</label>
            <select 
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos</option>
              <option value="workshop">🎯 Workshops</option>
              <option value="session">💬 Sessions</option>
              <option value="demo">🚀 Demos</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>⏰ Tiempo</label>
            <select 
              value={filters.timeRange} 
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>🎓 Dificultad</label>
            <select 
              value={filters.difficulty} 
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todas</option>
              <option value="beginner">🌱 Principiante</option>
              <option value="intermediate">🚀 Intermedio</option>
              <option value="advanced">💡 Avanzado</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>📊 Ordenar por</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="date">📅 Fecha</option>
              <option value="popularity">👥 Popularidad</option>
              <option value="title">🔤 Título</option>
            </select>
          </div>
        </div>

        {/* Resultados y filtros activos */}
        <div className={styles.filtersInfo}>
          <span className={styles.resultsCount}>
            📋 {upcomingEvents.length} evento{upcomingEvents.length !== 1 ? 's' : ''} encontrado{upcomingEvents.length !== 1 ? 's' : ''}
          </span>
          {(filters.type !== 'all' || filters.timeRange !== 'all' || filters.difficulty !== 'all' || filters.searchTerm) && (
            <button 
              onClick={() => setFilters({ type: 'all', timeRange: 'all', searchTerm: '', difficulty: 'all' })}
              className={styles.clearFilters}
            >
              🗑️ Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      <div className={styles.eventsGrid}>
        {upcomingEvents.length === 0 ? (
          <div className={styles.noEvents}>
            <p>🗓️ No hay eventos programados próximamente</p>
            <p>¡Mantente atento a nuestras redes sociales para nuevas fechas!</p>
          </div>
        ) : (
          upcomingEvents.map(event => (
            <div 
              key={event.id} 
              className={`${styles.eventCard} ${isEventToday(event.date) ? styles.todayEvent : ''}`}
              style={{ borderLeftColor: getEventTypeColor(event.type) }}
            >
              <div className={styles.eventHeader}>
                <span className={styles.eventIcon}>
                  {getEventTypeIcon(event.type)}
                </span>
                <div className={styles.eventMeta}>
                  <div className={styles.eventTitleRow}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <span 
                      className={styles.difficultyBadge}
                      style={{ backgroundColor: getDifficultyColor(event.difficulty) }}
                    >
                      {getDifficultyLabel(event.difficulty)}
                    </span>
                  </div>
                  <div className={styles.eventDetails}>
                    <span className={styles.eventDate}>
                      📅 {formatDate(event.date)}
                    </span>
                    <span className={styles.eventTime}>
                      ⏰ {event.time} GMT-3 ({event.duration})
                    </span>
                  </div>
                </div>
              </div>
              
              <p className={styles.eventDescription}>
                {event.description}
              </p>

              {/* Tags */}
              <div className={styles.eventTags}>
                {event.tags.map((tag, index) => (
                  <span key={index} className={styles.eventTag}>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Información de Asistencia */}
              <div className={styles.attendanceInfo}>
                <div className={styles.attendanceBar}>
                  <div 
                    className={styles.attendanceFill}
                    style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className={styles.eventFooter}>
                <div className={styles.eventInfo}>
                  <span>👨‍🏫 Instructor: {event.instructor}</span>
                  <span>🎥 Plataforma: {event.platform}</span>
                </div>
                
                <div className={styles.eventActions}>
                  {/* <button 
                    className={styles.addToCalendarBtn}
                    onClick={() => {
                      // Crear enlace para Google Calendar
                      // Ajuste para GMT-3 (Argentina)
                      const startDate = new Date(`${event.date}T${event.time}:00-03:00`);
                      const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // +2 horas
                      
                      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&ctz=America/Argentina/Buenos_Aires`;
                      
                      window.open(googleCalendarUrl, '_blank');
                    }}
                  >
                    📅 Agregar al Calendario
                  </button> */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.calendarFooter}>

      </div>
    </div>
  );
};

export default EventCalendar;
