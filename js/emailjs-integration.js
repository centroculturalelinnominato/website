/* ============================================
   EMAILJS Integration
   - Form contatti → email a centroculturalelinnominato
   - Newsletter → email di conferma all'iscritto
   ============================================ */

(function() {
  'use strict';

  // --- EmailJS Config (da aggiornare con i propri valori) ---
  const EMAILJS_PUBLIC_KEY = '__PUBLIC_KEY__';
  const EMAILJS_SERVICE_ID = '__SERVICE_ID__';
  const EMAILJS_TEMPLATE_CONTATTI = '__TEMPLATE_CONTATTI__';
  const EMAILJS_TEMPLATE_NEWSLETTER = '__TEMPLATE_NEWSLETTER__';

  // Init EmailJS
  function initEmailJS() {
    if (window.emailjs) {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initEmailJS();

    // --- CONTACT FORM ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = contactForm.querySelector('#nome').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const messaggio = contactForm.querySelector('#messaggio').value.trim();
        const btn = contactForm.querySelector('button[type="submit"]');

        if (!nome || !email || !messaggio) {
          showContactFeedback('Compila tutti i campi.', 'error');
          return;
        }

        const originalText = btn.textContent;
        btn.textContent = 'Invio in corso...';
        btn.disabled = true;

        try {
          if (!window.emailjs) throw new Error('Servizio email non disponibile.');

          await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONTATTI, {
            from_name: nome,
            from_email: email,
            message: messaggio
          });

          showContactFeedback('Messaggio inviato con successo! Ti risponderemo al più presto.', 'success');
          contactForm.reset();
        } catch (err) {
          console.error('EmailJS contact error:', err);
          showContactFeedback('Errore durante l\'invio. Riprova oppure scrivici a centroculturalelinnominato@gmail.com', 'error');
        } finally {
          btn.textContent = originalText;
          btn.disabled = false;
        }
      });
    }

    // --- NEWSLETTER CONFIRMATION EMAIL ---
    // Listen for custom event dispatched by newsletter.js after successful Supabase insert
    document.addEventListener('newsletter:subscribed', async (e) => {
      const email = e.detail && e.detail.email;
      if (!email || !window.emailjs) return;

      try {
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_NEWSLETTER, {
          subscriber_email: email
        });
      } catch (err) {
        console.error('EmailJS newsletter confirmation error:', err);
        // Non-blocking: the subscription is already saved in Supabase
      }
    });
  });

  function showContactFeedback(message, type) {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Remove existing
    const existing = form.parentElement.querySelector('.contact-feedback');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'contact-feedback';
    el.textContent = message;
    el.style.cssText = 'margin-top:1rem; padding:1rem; border-radius:10px; text-align:center; font-size:0.92rem; font-weight:500;';

    if (type === 'success') {
      el.style.background = '#f0fdf4';
      el.style.color = '#15803d';
      el.style.border = '1px solid #86efac';
    } else {
      el.style.background = '#fef2f2';
      el.style.color = '#c0392b';
      el.style.border = '1px solid #f5c6cb';
    }

    form.insertAdjacentElement('afterend', el);

    setTimeout(() => {
      el.style.transition = 'opacity 0.3s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 6000);
  }
})();
