/* ============================================
   FORM ISCRIZIONE SOCIO - Supabase Integration
   ============================================ */

(function() {
  'use strict';

  // --- Supabase Config ---
  const SUPABASE_URL = 'https://agehmykgppgkkyekhdjy.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZWhteWtncHBna2t5ZWtoZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTAxMzEsImV4cCI6MjA4OTY2NjEzMX0.3TeRB53OglppgAEwxEUOMsvfrOggKUodp7W9hdAACxA';

  let supabaseClient = null;

  function initSupabase() {
    if (window.supabase && window.supabase.createClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  }

  // --- Create Modal HTML ---
  function createModal() {
    const modal = document.createElement('div');
    modal.id = 'socio-modal';
    modal.className = 'socio-modal';
    modal.innerHTML = `
      <div class="socio-modal-overlay"></div>
      <div class="socio-modal-container">
        <button class="socio-modal-close" aria-label="Chiudi">&times;</button>

        <div class="socio-modal-header">
          <h2>Modulo di Ammissione Socio</h2>
          <p>Anno 2026 &mdash; Centro Culturale &ldquo;L'Innominato&rdquo;</p>
        </div>

        <form id="socio-form" class="socio-form" novalidate>
          <!-- Riga 1: Nome / Cognome -->
          <div class="form-row">
            <div class="form-group">
              <label for="sf-nome">Nome <span class="req">*</span></label>
              <input type="text" id="sf-nome" name="nome" required autocomplete="given-name">
            </div>
            <div class="form-group">
              <label for="sf-cognome">Cognome <span class="req">*</span></label>
              <input type="text" id="sf-cognome" name="cognome" required autocomplete="family-name">
            </div>
          </div>

          <!-- Riga 2: Email / Cellulare -->
          <div class="form-row">
            <div class="form-group">
              <label for="sf-email">Email <span class="req">*</span></label>
              <input type="email" id="sf-email" name="email" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="sf-cellulare">Cellulare <span class="req">*</span></label>
              <input type="tel" id="sf-cellulare" name="cellulare" required autocomplete="tel">
            </div>
          </div>

          <!-- Riga 3: Genere / Data nascita -->
          <div class="form-row">
            <div class="form-group">
              <label for="sf-genere">Genere <span class="req">*</span></label>
              <select id="sf-genere" name="genere" required>
                <option value="" disabled selected>Seleziona...</option>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Preferisco non rispondere">Preferisco non rispondere</option>
              </select>
            </div>
            <div class="form-group">
              <label for="sf-data-nascita">Data di nascita <span class="req">*</span></label>
              <input type="date" id="sf-data-nascita" name="data_nascita" required>
            </div>
          </div>

          <!-- Riga 4: Nato/a a / Provincia -->
          <div class="form-row">
            <div class="form-group">
              <label for="sf-luogo-nascita">Nato/a a <span class="req">*</span></label>
              <input type="text" id="sf-luogo-nascita" name="luogo_nascita" required>
            </div>
            <div class="form-group">
              <label for="sf-provincia">Provincia <span class="req">*</span></label>
              <input type="text" id="sf-provincia" name="provincia" required maxlength="2" placeholder="es. MI" style="text-transform: uppercase;">
            </div>
          </div>

          <!-- Riga 5: Comune residenza / Indirizzo -->
          <div class="form-row">
            <div class="form-group">
              <label for="sf-comune">Comune di residenza <span class="req">*</span></label>
              <input type="text" id="sf-comune" name="comune_residenza" required>
            </div>
            <div class="form-group">
              <label for="sf-indirizzo">Indirizzo e numero civico <span class="req">*</span></label>
              <input type="text" id="sf-indirizzo" name="indirizzo" required autocomplete="street-address">
            </div>
          </div>

          <!-- Riga 6: Codice Fiscale -->
          <div class="form-row">
            <div class="form-group form-group-full">
              <label for="sf-cf">Codice Fiscale <span class="req">*</span></label>
              <input type="text" id="sf-cf" name="codice_fiscale" required maxlength="16" placeholder="RSSMRA85M01H501Z" style="text-transform: uppercase;">
            </div>
          </div>

          <!-- Dichiarazioni -->
          <div class="form-declarations">
            <h3>Dichiarazioni</h3>

            <label class="form-check">
              <input type="checkbox" id="sf-statuto" name="accetta_statuto" required>
              <span>Dichiaro di aver preso visione dello <strong>Statuto</strong>, di accettarlo e di condividere gli scopi dell'Associazione indicati all'art. 3.1. <span class="req">*</span></span>
            </label>

            <label class="form-check">
              <input type="checkbox" id="sf-privacy" name="accetta_privacy" required>
              <span>Dichiaro di aver preso visione dell'<strong>informativa sulla privacy</strong> ai sensi dell'art. 13 del GDPR e autorizzo il trattamento dei dati personali. <span class="req">*</span></span>
            </label>

            <label class="form-check">
              <input type="checkbox" id="sf-quota" name="accetta_quota" required>
              <span>Mi impegno a versare la <strong>quota associativa annuale di &euro; 10,00</strong>. <span class="req">*</span></span>
            </label>
          </div>

          <!-- Pagamento -->
          <div class="form-payment">
            <p><strong>Versamento quota associativa 10&euro; &mdash; Anno 2026</strong></p>
            <p>Puoi versare la quota tramite <a href="https://tag.satispay.com/centroculturalelinnominato" target="_blank" rel="noopener"><strong>SatisPay</strong></a> oppure con <a href="https://paypal.me/CCLInnominato/10" target="_blank" rel="noopener"><strong>altri pagamenti digitali</strong></a>.</p>
          </div>

          <!-- Submit -->
          <div class="form-actions">
            <button type="submit" class="btn btn-primary socio-submit-btn">
              <span class="btn-text">Invia domanda di iscrizione</span>
              <span class="btn-loading" style="display:none;">
                <i class="fas fa-spinner fa-spin"></i> Invio in corso...
              </span>
            </button>
          </div>

          <!-- Messages -->
          <div id="socio-form-message" class="form-message" style="display:none;"></div>
        </form>

        <!-- Success State -->
        <div id="socio-success" class="socio-success" style="display:none;">
          <div class="success-icon"><i class="fas fa-check-circle"></i></div>
          <h2>Iscrizione inviata!</h2>
          <p>Grazie per la tua richiesta di adesione al Centro Culturale L'Innominato. Riceverai una conferma via email.</p>
          <p style="margin-top:1.5rem;"><strong>Ricordati di versare la quota associativa di 10&euro;</strong></p>
          <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; margin-top:1rem;">
            <a href="https://tag.satispay.com/centroculturalelinnominato" target="_blank" rel="noopener" class="btn btn-teal" style="font-size:0.85rem;">Paga con SatisPay</a>
            <a href="https://paypal.me/CCLInnominato/10" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.85rem;">Altri metodi</a>
          </div>
          <button class="btn btn-secondary socio-close-success" style="margin-top:2rem;">Chiudi</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  // --- Modal Controls ---
  function openModal() {
    const modal = document.getElementById('socio-modal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('socio-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- Form Validation ---
  function validateForm(form) {
    const fields = form.querySelectorAll('[required]');
    let valid = true;

    fields.forEach(field => {
      field.classList.remove('error');
      if (field.type === 'checkbox' && !field.checked) {
        field.classList.add('error');
        valid = false;
      } else if (field.type !== 'checkbox' && !field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    // Email validation
    const email = form.querySelector('#sf-email');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('error');
      valid = false;
    }

    // Codice Fiscale validation (16 chars)
    const cf = form.querySelector('#sf-cf');
    if (cf && cf.value && cf.value.trim().length !== 16) {
      cf.classList.add('error');
      valid = false;
    }

    return valid;
  }

  // --- Submit to Supabase ---
  async function submitForm(form) {
    const data = {
      email: form.querySelector('#sf-email').value.trim(),
      nome: form.querySelector('#sf-nome').value.trim(),
      cognome: form.querySelector('#sf-cognome').value.trim(),
      genere: form.querySelector('#sf-genere').value,
      luogo_nascita: form.querySelector('#sf-luogo-nascita').value.trim(),
      provincia: form.querySelector('#sf-provincia').value.trim().toUpperCase(),
      data_nascita: form.querySelector('#sf-data-nascita').value,
      comune_residenza: form.querySelector('#sf-comune').value.trim(),
      indirizzo: form.querySelector('#sf-indirizzo').value.trim(),
      codice_fiscale: form.querySelector('#sf-cf').value.trim().toUpperCase(),
      cellulare: form.querySelector('#sf-cellulare').value.trim(),
      accetta_statuto: form.querySelector('#sf-statuto').checked,
      accetta_privacy: form.querySelector('#sf-privacy').checked,
      accetta_quota: form.querySelector('#sf-quota').checked
    };

    if (!supabaseClient) {
      initSupabase();
    }

    if (!supabaseClient) {
      throw new Error('Impossibile connettersi al database. Riprova più tardi.');
    }

    const { error } = await supabaseClient
      .from('iscrizioni')
      .insert([data]);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Errore durante l\'invio. Riprova.');
    }
  }

  // --- Show Message ---
  function showMessage(msg, type) {
    const el = document.getElementById('socio-form-message');
    if (!el) return;
    el.textContent = msg;
    el.className = 'form-message ' + type;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    // Create modal
    createModal();

    // Init Supabase
    initSupabase();

    // Open modal on click
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.open-socio-form');
      if (trigger) {
        e.preventDefault();
        // Reset form state
        const form = document.getElementById('socio-form');
        const success = document.getElementById('socio-success');
        if (form) { form.reset(); form.style.display = ''; }
        if (success) success.style.display = 'none';
        document.getElementById('socio-form-message').style.display = 'none';
        openModal();
      }
    });

    // Close modal
    const modal = document.getElementById('socio-modal');
    modal.querySelector('.socio-modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('.socio-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.socio-close-success').addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Form submit
    const form = document.getElementById('socio-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate
      if (!validateForm(form)) {
        showMessage('Compila tutti i campi obbligatori.', 'error');
        return;
      }

      // Loading state
      const btnText = form.querySelector('.btn-text');
      const btnLoad = form.querySelector('.btn-loading');
      const submitBtn = form.querySelector('.socio-submit-btn');
      btnText.style.display = 'none';
      btnLoad.style.display = 'inline';
      submitBtn.disabled = true;

      try {
        await submitForm(form);
        // Success
        form.style.display = 'none';
        document.getElementById('socio-success').style.display = 'block';
      } catch (err) {
        showMessage(err.message || 'Errore durante l\'invio. Riprova.', 'error');
      } finally {
        btnText.style.display = '';
        btnLoad.style.display = 'none';
        submitBtn.disabled = false;
      }
    });

    // Remove error class on input
    form.addEventListener('input', (e) => {
      e.target.classList.remove('error');
    });
    form.addEventListener('change', (e) => {
      e.target.classList.remove('error');
    });
  });
})();
