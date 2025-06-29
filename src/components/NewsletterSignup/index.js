import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes integrar con tu servicio de newsletter
    console.log('Newsletter signup:', email);
    setIsSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className="newsletter-signup">
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
      <h3>Mantente Actualizado</h3>
      <p>
        Recibe las últimas noticias sobre DevOps, nuevos contenidos y recursos exclusivos 
        directamente en tu inbox.
      </p>
      
      {isSubmitted ? (
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.2)', 
          padding: '1rem', 
          borderRadius: '8px', 
          color: 'white',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>✅</span>
          ¡Gracias por suscribirte! Te mantendremos informado.
        </div>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="newsletter-input"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="newsletter-button">
            Suscribirme 🚀
          </button>
        </form>
      )}
      
      <div style={{ 
        fontSize: '0.8rem', 
        opacity: 0.8, 
        marginTop: '1rem',
        textAlign: 'center'
      }}>
        📨 Sin spam, solo contenido valioso • Cancela cuando quieras
      </div>
    </div>
  );
}
