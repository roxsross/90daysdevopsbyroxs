import React, { useState } from 'react';
import styles from './EventRegistration.module.css';

const EventRegistration = ({ event, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: 'beginner',
    interests: [],
    notifications: true
  });

  const experienceLevels = [
    { value: 'beginner', label: 'Principiante 🌱', description: 'Nuevo en DevOps' },
    { value: 'intermediate', label: 'Intermedio 🚀', description: '1-3 años de experiencia' },
    { value: 'advanced', label: 'Avanzado 💡', description: '3+ años de experiencia' }
  ];

  const interestTopics = [
    'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform', 
    'Ansible', 'Jenkins', 'Monitoring', 'Security', 'GitOps'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    
    try {
      // Simular registro (aquí iría la lógica real de registro)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Agregar al calendario automáticamente
      const startDate = new Date(`${event.date}T${event.time}:00-03:00`);
      const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000));
      
      const calendarData = {
        title: event.title,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        description: `${event.description}\n\nRegistrado como: ${formData.name}\nNivel: ${formData.experience}`,
        location: event.platform
      };

      // Llamar callback de registro
      if (onRegister) {
        onRegister({ ...formData, event: event.id, calendarData });
      }

      setIsRegistered(true);
      
      // Mostrar notificación de éxito
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`✅ Registrado en: ${event.title}`, {
          body: `Te enviaremos un recordatorio antes del evento`,
          icon: '/img/295.png'
        });
      }
      
    } catch (error) {
      console.error('Error al registrarse:', error);
      alert('Error al registrarse. Por favor intenta de nuevo.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isRegistered) {
    return (
      <div className={styles.registrationSuccess}>
        <div className={styles.successIcon}>🎉</div>
        <h3>¡Registro Exitoso!</h3>
        <p>Te has registrado para <strong>{event.title}</strong></p>
        <div className={styles.successDetails}>
          <p>📧 Recibirás un email de confirmación</p>
          <p>⏰ Te recordaremos 15 minutos antes</p>
          <p>📅 Evento agregado a tu calendario</p>
        </div>
        <div className={styles.successActions}>
          <button 
            onClick={() => window.open(event.platform.includes('Discord') ? 'https://discord.com/invite/RWQjCRaVJ3' : 'https://www.youtube.com/@295devops', '_blank')}
            className={styles.joinBtn}
          >
            🔗 Ir a la Plataforma
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.eventRegistration}>
      <div className={styles.eventHeader}>
        <h3>📝 Registro para {event.title}</h3>
        <p className={styles.eventDate}>
          📅 {new Date(event.date).toLocaleDateString('es-AR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} - ⏰ {event.time} GMT-3
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.registrationForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">👤 Nombre Completo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Tu nombre completo"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">📧 Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="tu@email.com"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>🎯 Nivel de Experiencia</label>
          <div className={styles.experienceOptions}>
            {experienceLevels.map(level => (
              <label key={level.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name="experience"
                  value={level.value}
                  checked={formData.experience === level.value}
                  onChange={handleInputChange}
                />
                <div className={styles.radioContent}>
                  <strong>{level.label}</strong>
                  <span>{level.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>🔍 Temas de Interés (opcional)</label>
          <div className={styles.interestTags}>
            {interestTopics.map(topic => (
              <button
                key={topic}
                type="button"
                onClick={() => handleInterestToggle(topic)}
                className={`${styles.interestTag} ${formData.interests.includes(topic) ? styles.selected : ''}`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleInputChange}
            />
            <span>🔔 Recibir recordatorios por email</span>
          </label>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={isRegistering}
            className={styles.registerBtn}
          >
            {isRegistering ? (
              <>
                <span className={styles.spinner}></span>
                Registrando...
              </>
            ) : (
              <>🚀 Registrarme al Evento</>
            )}
          </button>
        </div>
      </form>

      <div className={styles.registrationInfo}>
        <h4>ℹ️ Información del Registro</h4>
        <ul>
          <li>✅ El registro es <strong>gratuito</strong></li>
          <li>📧 Recibirás material preparatorio por email</li>
          <li>⏰ Te recordaremos 15 minutos antes del evento</li>
          <li>🎯 Acceso a canal exclusivo de Discord</li>
          <li>📁 Material de apoyo descargable</li>
        </ul>
      </div>
    </div>
  );
};

export default EventRegistration;
