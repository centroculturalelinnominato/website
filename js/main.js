/* ============================================
   CENTRO CULTURALE L'INNOMINATO - Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('active');
      // Blocca scroll del body quando il menu è aperto
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Close mobile nav on scroll ---
  if (hamburger && nav) {
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (nav.classList.contains('open')) {
        const delta = Math.abs(window.scrollY - lastScrollY);
        if (delta > 10) {
          nav.classList.remove('open');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
      lastScrollY = window.scrollY;
    }, { passive: true });
  }

  // --- Hero Slider ---
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  }

  // --- Back to Top Button ---
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Animate on Scroll ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if (animateElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));
  }

  // --- Header scroll effect ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.12)';
      } else {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
      }
    });
  }

  // --- Set active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
