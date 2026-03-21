/* ============================================
   NEWSLETTER - Supabase Integration
   ============================================ */

(function() {
  'use strict';

  const SUPABASE_URL = 'https://agehmykgppgkkyekhdjy.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZWhteWtncHBna2t5ZWtoZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTAxMzEsImV4cCI6MjA4OTY2NjEzMX0.3TeRB53OglppgAEwxEUOMsvfrOggKUodp7W9hdAACxA';

  let supabaseClient = null;

  function getClient() {
    if (!supabaseClient && window.supabase && window.supabase.createClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.newsletter-form');

    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = form.querySelector('input[type="email"]');
        const btn = form.querySelector('button[type="submit"]');
        const email = input ? input.value.trim() : '';

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showFeedback(form, 'Inserisci un indirizzo email valido.', 'error');
          return;
        }

        // Loading state
        const originalText = btn.textContent;
        btn.textContent = 'Invio...';
        btn.disabled = true;

        try {
          const client = getClient();
          if (!client) throw new Error('Connessione non disponibile.');

          const { error } = await client
            .from('newsletter')
            .insert([{ email: email }]);

          if (error) {
            // Duplicate email (unique constraint)
            if (error.code === '23505') {
              showFeedback(form, 'Questa email è già iscritta alla newsletter!', 'info');
            } else {
              throw error;
            }
          } else {
            showFeedback(form, 'Iscrizione avvenuta con successo! Controlla la tua email.', 'success');
            // Dispatch event for EmailJS confirmation email
            document.dispatchEvent(new CustomEvent('newsletter:subscribed', { detail: { email: email } }));
            input.value = '';
          }
        } catch (err) {
          console.error('Newsletter error:', err);
          showFeedback(form, 'Errore durante l\'iscrizione. Riprova.', 'error');
        } finally {
          btn.textContent = originalText;
          btn.disabled = false;
        }
      });
    });
  });

  function showFeedback(form, message, type) {
    // Remove existing feedback
    const existing = form.parentElement.querySelector('.newsletter-feedback');
    if (existing) existing.remove();

    const el = document.createElement('p');
    el.className = 'newsletter-feedback newsletter-feedback--' + type;
    el.textContent = message;

    // Style based on type
    el.style.marginTop = '0.8rem';
    el.style.padding = '0.6rem 1rem';
    el.style.borderRadius = '8px';
    el.style.fontSize = '0.9rem';
    el.style.fontWeight = '500';
    el.style.textAlign = 'center';

    if (type === 'success') {
      el.style.background = 'rgba(26,191,176,0.15)';
      el.style.color = '#0d9488';
    } else if (type === 'error') {
      el.style.background = 'rgba(231,76,60,0.12)';
      el.style.color = '#c0392b';
    } else {
      el.style.background = 'rgba(42,143,189,0.12)';
      el.style.color = '#2A8FBD';
    }

    form.insertAdjacentElement('afterend', el);

    // Auto-remove after 5s
    setTimeout(() => {
      el.style.transition = 'opacity 0.3s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 5000);
  }
})();
