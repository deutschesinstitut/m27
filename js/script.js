/**
 * Deutsches Institut in Sohag – Main Script
 * Version: 1.0 | Vanilla JS Only
 */

'use strict';

// ── Helpers ────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── DOM Ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initParticles();
  initCourseTabs();
  initCounters();
  initBackToTop();
  initActiveNavLinks();
  initFormHandler();
});

// ── 1. Theme (Dark / Light) ────────────────────────────────
function initTheme() {
  const toggle = $('#theme-toggle');
  const root = document.documentElement;
  const STORAGE_KEY = 'di-sohag-theme';

  // Default: dark
  const savedTheme = localStorage.getItem(STORAGE_KEY) || 'dark';
  applyTheme(savedTheme);

  toggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.innerHTML = theme === 'dark'
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06a.996.996 0 0 0 0 1.41c.39.39 1.03.39 1.41 0l1.06-1.06a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0zM7.05 18.36l-1.06 1.06a.996.996 0 0 0 0 1.41c.39.39 1.03.39 1.41 0l1.06-1.06a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0z"/></svg>';
    }
    // Update meta theme-color
    let metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme === 'dark' ? '#0a0d14' : '#f7f8fc';
    }
  }
}

// ── 2. Navbar scroll effect ────────────────────────────────
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── 3. Mobile Nav ──────────────────────────────────────────
function initMobileNav() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on link click
  $$('a', mobileNav).forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    }
  });
}

// ── 4. Scroll Reveal ───────────────────────────────────────
function initScrollReveal() {
  const elements = $$('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger based on sibling index
        const delay = (entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  elements.forEach((el, i) => {
    // Auto-stagger siblings
    if (!el.dataset.delay) {
      const siblings = el.parentElement
        ? $$('.reveal, .reveal-left, .reveal-right', el.parentElement)
        : [];
      const idx = siblings.indexOf(el);
      if (idx > 0) el.dataset.delay = idx * 80;
    }
    observer.observe(el);
  });
}

// ── 5. Hero Particles ──────────────────────────────────────
function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 10 : 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      right: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * -20}s;
    `;
    container.appendChild(p);
  }
}

// ── 6. Course Tabs ─────────────────────────────────────────
function initCourseTabs() {
  const tabs = $$('.course-tab');
  const cards = $$('.course-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const level = tab.dataset.level;

      cards.forEach(card => {
        if (level === 'all' || card.dataset.level === level) {
          card.style.display = '';
          card.style.animation = 'fade-in 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ── 7. Animated Counters ───────────────────────────────────
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOut(progress) * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ── 8. Back to Top ─────────────────────────────────────────
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── 9. Active Nav Link Highlight ───────────────────────────
function initActiveNavLinks() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a[href^="#"], .mobile-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

// ── 10. Form Handler ───────────────────────────────────────
function initFormHandler() {
  const form = $('#registration-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const originalText = btn.textContent;

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      showFormMessage(form, 'يرجى ملء جميع الحقول المطلوبة.', 'error');
      return;
    }

    // Simulate submission (replace with actual endpoint / Google Forms redirect)
    btn.textContent = 'جارٍ الإرسال...';
    btn.disabled = true;

    // Build WhatsApp message from form data
    const data = new FormData(form);
    const name    = data.get('name') || '';
    const phone   = data.get('phone') || '';
    const age     = data.get('age') || '';
    const level   = data.get('level') || '';
    const format  = data.get('format') || '';
    const goal    = data.get('goal') || '';

    const msg = `مرحباً، أرغب في التسجيل في المعهد الألماني في سوهاج.%0A
الاسم: ${name}%0A
الهاتف: ${phone}%0A
العمر: ${age}%0A
المستوى المطلوب: ${level}%0A
طريقة التعلم: ${format}%0A
الهدف: ${goal}`;

    setTimeout(() => {
      btn.textContent = '✓ تم الإرسال بنجاح';
      btn.style.background = '#2eb87a';
      showFormMessage(form, 'شكراً لك! سيتواصل معك فريق المعهد قريباً.', 'success');

      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/201149487442?text=${msg}`, '_blank');

      // Reset after delay
      setTimeout(() => {
        form.reset();
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        const msgEl = form.querySelector('.form-message');
        if (msgEl) msgEl.remove();
      }, 5000);
    }, 900);
  });
}

function showFormMessage(form, text, type) {
  let el = form.querySelector('.form-message');
  if (!el) {
    el = document.createElement('div');
    el.className = 'form-message';
    form.appendChild(el);
  }
  el.textContent = text;
  el.style.cssText = `
    margin-top: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    background: ${type === 'success' ? 'rgba(46,184,122,0.12)' : 'rgba(224,82,82,0.12)'};
    border: 1px solid ${type === 'success' ? 'rgba(46,184,122,0.35)' : 'rgba(224,82,82,0.35)'};
    color: ${type === 'success' ? '#2eb87a' : '#e05252'};
  `;
}

// ── 11. Smooth Scroll for anchor links ────────────────────
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const id = anchor.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
  window.scrollTo({ top, behavior: 'smooth' });
});

// ── Error field styling ─────────────────────────────────────
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('error')) {
    e.target.classList.remove('error');
  }
}, true);

// Add error style dynamically
const errorStyle = document.createElement('style');
errorStyle.textContent = `.form-control.error { border-color: #e05252 !important; box-shadow: 0 0 0 3px rgba(224,82,82,0.15) !important; }`;
document.head.appendChild(errorStyle);

// ── 12. Success Stories Image Lightbox ────────────────────
window.openLightbox = function(src, caption) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  if (!modal || !img) return;

  img.src = src;
  if (cap) cap.textContent = caption || '';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  if (!modal) return;

  modal.classList.remove('open');
  if (img) img.src = '';
  document.body.style.overflow = '';
};

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeLightbox();
  }
});
