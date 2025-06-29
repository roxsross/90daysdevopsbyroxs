import React from 'react';
import CommunityCTA from '../CommunityCTA';
import NewsletterSignup from '../NewsletterSignup';

export default function PreFooter() {
  return (
    <>
      <CommunityCTA />
      <div style={{
        background: 'linear-gradient(135deg, var(--ifm-color-secondary) 0%, var(--ifm-color-secondary-dark) 100%)',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <NewsletterSignup />
      </div>
    </>
  );
}
