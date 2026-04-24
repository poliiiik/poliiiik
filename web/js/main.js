// 3Trapol

// Aktuální rok v patičce
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

// Mobilní menu
const burger = document.querySelector('.burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.textContent = open ? '✕' : '☰';
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.textContent = '☰';
    })
  );
}

// Reveal on scroll
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lightboxImg');
const lbLabel  = document.getElementById('lightboxLabel');
const lbClose  = document.getElementById('lightboxClose');

function openLightbox(src, alt, label) {
  lbImg.src = src;
  lbImg.alt = alt || '';
  lbLabel.textContent = label || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 300);
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) openLightbox(img.src, img.alt, item.dataset.label);
  });
  item.setAttribute('tabindex', '0');
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
  });
});

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox();
});

// Formulář — Formspree AJAX
const form = document.querySelector('form.contact-form');
if (form) {
  form.addEventListener('submit', async e => {
    const action = form.getAttribute('action') || '';
    if (action.includes('YOUR_FORMSPREE_ID')) return; // fallback if not configured

    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Odesílám…';
    btn.disabled = true;

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = '✓ Odesláno — ozveme se do 24 h';
        btn.style.background = '#5a8a3c';
        form.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Chyba — zkuste znovu nebo zavolejte';
      btn.style.background = '#8b2222';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = original; btn.style.background = ''; }, 4000);
    }
  });
}
