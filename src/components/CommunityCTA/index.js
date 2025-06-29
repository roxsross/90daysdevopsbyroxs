import React from 'react';

export default function CommunityCTA() {
  return (
    <div className="community-cta">
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
      <h2>¡Únete a Nuestra Comunidad DevOps!</h2>
      <p>
        Acelera tu aprendizaje conectando con miles de profesionales DevOps. Comparte experiencias, 
        resuelve dudas y mantente al día con las últimas tendencias y herramientas.
      </p>
      
      <div className="cta-buttons">
        <a 
          href="https://discord.com/invite/RWQjCRaVJ3" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta-button primary"
        >
          💬 Únete a Discord
        </a>
        <a 
          href="https://www.youtube.com/@295devops" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta-button"
        >
          📺 Suscríbete a YouTube
        </a>
        <a 
          href="https://www.linkedin.com/in/roxsross/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta-button"
        >
          💼 Síguenos en LinkedIn
        </a>
      </div>
      
      <div className="social-proof">
        <div className="social-proof-item">
          <span className="icon">👥</span>
          <span>+5K Estudiantes</span>
        </div>
        <div className="social-proof-item">
          <span className="icon">🎓</span>
          <span>90 Días de Contenido</span>
        </div>
        <div className="social-proof-item">
          <span className="icon">🌟</span>
          <span>Comunidad Activa</span>
        </div>
        <div className="social-proof-item">
          <span className="icon">🔄</span>
          <span>Actualizaciones Semanales</span>
        </div>
      </div>
    </div>
  );
}
